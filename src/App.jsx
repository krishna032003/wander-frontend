import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './Home';
import Chat from './Chat';
import Documents from './Documents';
import { useTheme } from './ThemeContext';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const API_BASE_URL = 'http://localhost:8000/api';

export default function WanderGuideApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('home');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    checkServerHealth();
    fetchCurrentLocation();
    if (activeView === 'documents') {
      fetchDocuments();
    }
  }, [activeView]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const checkServerHealth = async () => {
    try {
      await fetch(`${API_BASE_URL}/health`);
    } catch (error) {
      console.error('Server health check failed:', error);
    }
  };

  const fetchCurrentLocation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/location/current`);
      const data = await response.json();
      if (data.current_location) {
        setCurrentLocation(data.current_location);
      }
    } catch (error) {
      console.error('Failed to fetch location:', error);
    }
  };

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/documents/list`);
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          history: chatHistory.map(msg => [msg.content, ''])
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const botMessage = {
        role: 'assistant',
        content: data.reply,
      };

      setChatHistory(prev => [...prev, botMessage]);

      if (data.location_detected) {
        setCurrentLocation(data.location_detected);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}`,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const setLocation = async (location) => {
    if (!location.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/location/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setCurrentLocation(data.location);
      // Consider a less intrusive notification system
    } catch (error) {
      console.error('Location error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const response = await fetch(`${API_BASE_URL}/voice/transcribe`, {
            method: 'POST',
            body: formData
          });

          const data = await response.json();
          
          if (data.transcription) {
            setCurrentMessage(data.transcription);
          }
        } catch (error) {
          console.error('Transcription error:', error);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      
      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, 5000);

    } catch (error) {
      console.error('Microphone error:', error);
      setIsRecording(false);
    }
  };

  const speakText = async (text) => {
    setIsSpeaking(true);
    try {
      const response = await fetch(`${API_BASE_URL}/voice/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('TTS not available');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsSpeaking(false);
    }
  };

  const uploadDocument = async (file) => {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData
      });

      await response.json();
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (filename) => {
    if (!confirm(`Delete ${filename}?`)) return;

    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/documents/delete/${filename}`, {
        method: 'DELETE'
      });
      fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshKnowledgeBase = async () => {
    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/documents/refresh`, {
        method: 'POST'
      });
      fetchDocuments();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (view) => {
    setActiveView(view);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'chat':
        return (
          <Chat
            chatHistory={chatHistory}
            isLoading={isLoading}
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            sendMessage={sendMessage}
            handleVoiceInput={handleVoiceInput}
            isRecording={isRecording}
            speakText={speakText}
            isSpeaking={isSpeaking}
            chatEndRef={chatEndRef}
          />
        );
      case 'documents':
        return (
          <Documents
            documents={documents}
            isLoading={isLoading}
            fileInputRef={fileInputRef}
            uploadDocument={uploadDocument}
            refreshKnowledgeBase={refreshKnowledgeBase}
            deleteDocument={deleteDocument}
          />
        );
      case 'home':
      default:
        return (
          <Home
            currentLocation={currentLocation}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setLocation={setLocation}
            handleNavigation={handleNavigation}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 selection:bg-teal-100 dark:bg-slate-950 dark:selection:bg-teal-900 text-slate-900 dark:text-slate-50">
      <div className="absolute inset-0 z-[-1]">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074"
          alt="Background Texture"
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob delay-1000" />
        <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-blue-500/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob delay-700" />
      </div>
      
      <div className="relative z-10 h-full">
        <Topbar 
          theme={theme}
          toggleTheme={toggleTheme}
        />
        
        <Sidebar
          activeView={activeView}
          onNavigate={handleNavigation}
        />

        <div className="relative h-full pl-[90px]">
          <AnimatePresence mode="wait">
            <motion.main 
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full overflow-y-auto pt-[120px] bg-transparent"
            >
              {renderContent()}
            </motion.main>
          </AnimatePresence>
        </div>
      </div>
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
}
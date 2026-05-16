import { useState, useRef, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { get, post } from "../api/client";
import { ApiError } from "../api";
import { Mic, MicOff, Volume2, Camera, CameraOff, Hand, Send, RotateCcw, User, MessageSquare } from "lucide-react";

const QUICK_PHRASES = [
  "Xin chào",
  "Xin lỗi",
  "Tôi không hiểu",
  "Nói chậm hơn được không?",
  "Tôi cần giúp đỡ",
];


const DEMO_SIGN_TEXT = [
  "Tôi cần giúp đỡ",
  "Cảm ơn bác sĩ",
  "Tôi hiểu rồi",
];

type MessageType = {
  id: number;
  type: "voice" | "sign";
  original: string;
  translated: string;
  timestamp: Date;
};

export function Conversation() {
  // Speech to Sign states
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [manualInput, setManualInput] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [signAnimation, setSignAnimation] = useState("");
  const [signVideoUrl, setSignVideoUrl] = useState("");

  // Sign to Speech states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedSignText, setDetectedSignText] = useState("");
  const [editableText, setEditableText] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [textToSignError, setTextToSignError] = useState("");
  const [signToTextError, setSignToTextError] = useState("");
  const [recognitionError, setRecognitionError] = useState("");
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      mediaStreamRef.current = stream;
      setCameraError("");
      setIsCameraActive(true);
    } catch (error) {
      console.error("Lỗi mở camera:", error);
      setCameraError("Không thể mở camera. Vui lòng kiểm tra quyền truy cập camera trên trình duyệt.");
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch((playError) => {
        console.warn("Không thể tự động phát video camera:", playError);
      });
    }
  }, [isCameraActive]);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
      setDetectedSignText("");
      setEditableText("");
    } else {
      startCamera();
    }
  };

  // Conversation history
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const demoSpeechIndex = useRef(0);
  const demoSignIndex = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.warn("Lỗi khi dừng nhận dạng giọng nói:", error);
      }
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      audioStreamRef.current = stream;
      setRecognitionError("");
    } catch (error) {
      console.error("Lỗi truy cập mic:", error);
      setRecognitionError("Không thể truy cập micro. Vui lòng kiểm tra quyền truy cập micro trên trình duyệt.");
      return;
    }

    setIsListening(true);
    setRecognizedText("");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.warn("Lỗi bắt đầu nhận dạng giọng nói:", error);
        setRecognitionError("Không thể bắt đầu nhận dạng giọng nói. Vui lòng thử lại.");
        setIsListening(false);
      }
      return;
    }

    let charIndex = 0;
    const targetText = DEMO_SPEECH[demoSpeechIndex.current % DEMO_SPEECH.length];
    demoSpeechIndex.current++;
    
    intervalRef.current = setInterval(() => {
      charIndex++;
      setRecognizedText(targetText.slice(0, charIndex));
      if (charIndex >= targetText.length) {
        clearInterval(intervalRef.current!);
        setIsListening(false);
      }
    }, 60);
  };

  // Translate speech to sign
  const translateToSign = async () => {
    const text = recognizedText || manualInput;
    if (!text) return;
    
    setIsTranslating(true);
    setTextToSignError("");

    try {
      const endpoint = `/api/sign-videos/${encodeURIComponent(text)}`;
      console.log("[translateToSign] request endpoint:", endpoint);
      const result = await get<any>(endpoint);
      console.log("[translateToSign] response payload:", result);

      const animationText =
        typeof result === "string"
          ? result
          : result?.keyword || text;
      const videoUrl =
        typeof result === "object" && result?.videoUrl
          ? result.videoUrl
          : "";

      setSignAnimation(animationText || text);
      setSignVideoUrl(videoUrl);

      const newMessage: MessageType = {
        id: Date.now(),
        type: "voice",
        original: text,
        translated: animationText || text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error("Lỗi API text-to-sign:", error);
      setSignAnimation("");
      setSignVideoUrl("");
      setTextToSignError(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Lỗi dịch sang ký hiệu. Vui lòng thử lại."
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const startDetection = async () => {
    if (!isCameraActive) return;
    if (!videoRef.current) return;

    setIsDetecting(true);
    setSignToTextError("");

    const startTime = Date.now();

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Không thể tạo canvas");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);

      const usedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const response = await post<string>('/translate/sign-to-text', { image: imageData, usedSeconds });
      const detected = response || "";
      setDetectedSignText(detected);
      setEditableText(detected);
    } catch (error) {
      console.error("Lỗi API sign-to-text:", error);
      setSignToTextError(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Lỗi nhận dạng ký hiệu. Vui lòng thử lại."
      );
      setDetectedSignText("");
      setEditableText("");
    } finally {
      setIsDetecting(false);
    }
  };

  // Play voice from detected sign
  const playVoice = () => {
    const text = editableText || detectedSignText;
    if (!text) return;
    
    setIsSpeaking(true);
    setTimeout(() => {
      setIsSpeaking(false);
      
      // Add to conversation history
      const newMessage: MessageType = {
        id: Date.now(),
        type: "sign",
        original: `[Sign language detected]`,
        translated: text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
    }, 2000);
  };

  // Quick phrase handler
  const handleQuickPhrase = (phrase: string) => {
    setManualInput(phrase);
    setSignAnimation(phrase);
    
    const newMessage: MessageType = {
      id: Date.now(),
      type: "voice",
      original: phrase,
      translated: `[Sign animation: ${phrase}]`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const replayMessage = (message: MessageType) => {
    if (message.type === "voice") {
      setSignAnimation(message.original);
    } else {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "vi-VN";

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }
        if (finalTranscript) {
          // Chuẩn hóa text: lowercase, loại bỏ dấu chấm cuối, normalize Unicode
          const normalizedText = finalTranscript
            .toLowerCase()
            .replace(/[.,!?;:]$/, '') // Loại bỏ dấu chấm cuối
            .normalize('NFC'); // Chuẩn hóa Unicode cho tiếng Việt
          setRecognizedText(normalizedText);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event);
        setRecognitionError("Lỗi nhận diện giọng nói. Vui lòng thử lại.");
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setIsRecognitionSupported(true);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  useEffect(() => {
    if (isCameraActive && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch((playError) => {
        console.warn("Không thể tự động phát video camera:", playError);
      });
    }
  }, [isCameraActive]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f1f5f9" }}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1F2937" }}>
            💬 Hội thoại trực tiếp
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            Giao tiếp hai chiều giữa tiếng nói và ngôn ngữ ký hiệu
          </p>
        </div>

        {/* MAIN SPLIT PANELS */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          
          {/* LEFT PANEL - Speech/Text → Sign Language */}
          <div className="rounded-3xl p-8 shadow-lg" style={{ backgroundColor: "white" }}>
            <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: "2px solid #EFF6FF" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#EFF6FF" }}>
                <Mic size={24} color="#2563EB" />
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1F2937" }}>
                  Giọng nói → Ký hiệu
                </h2>
                <p style={{ fontSize: 12, color: "#6B7280" }}>Người nghe nói</p>
              </div>
            </div>

            {/* Large Microphone Button */}
            <div className="flex flex-col items-center mb-6">
              <button
                onClick={isListening ? stopListening : startListening}
                className="relative rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95"
                style={{ 
                  width: 120, 
                  height: 120, 
                  backgroundColor: isListening ? "#DC2626" : "#2563EB",
                }}
              >
                {isListening && (
                  <>
                    <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: "#DC2626", opacity: 0.4 }} />
                    <span className="absolute inset-0 rounded-full animate-pulse" style={{ backgroundColor: "#DC2626", opacity: 0.3 }} />
                  </>
                )}
                {isListening ? <MicOff size={48} color="white" /> : <Mic size={48} color="white" />}
              </button>
              
              <div className="mt-4 text-center">
                <div style={{ 
                  fontSize: 14, 
                  fontWeight: 700, 
                  color: isListening ? "#DC2626" : "#2563EB",
                  textTransform: "uppercase",
                  letterSpacing: 1
                }}>
                  {isListening ? "🔴 Đang nghe..." : "Nhấn để nói"}
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                  {isListening ? "Nhấn lại để dừng" : "Hoặc gõ văn bản bên dưới"}
                </div>
              </div>
            </div>

            {/* Transcription Area */}
            <div
              className="rounded-2xl p-6 min-h-32 relative mb-4"
              style={{ 
                backgroundColor: "#f8fafc", 
                border: "3px solid #e5e7eb",
                transition: "border-color 0.3s"
              }}
            >
              {recognizedText ? (
                <p style={{ fontSize: 28, fontWeight: 700, color: "#1F2937", lineHeight: 1.4 }}>
                  {recognizedText}
                  {isListening && <span className="animate-pulse" style={{ color: "#2563EB" }}>|</span>}
                </p>
              ) : (
                <p style={{ fontSize: 16, color: "#9CA3AF", fontStyle: "italic" }}>
                  Văn bản nhận dạng sẽ hiển thị ở đây...
                </p>
              )}
            </div>

            {recognitionError && (
              <div className="mb-4 rounded-2xl p-4" style={{ backgroundColor: "#FEF3C7", border: "2px solid #FDE68A" }}>
                <p style={{ fontSize: 13, color: "#92400E" }}>
                  {recognitionError}
                </p>
              </div>
            )}

            {/* Manual Text Input */}
            {/* <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Hoặc gõ văn bản thủ công..."
              className="w-full rounded-2xl p-4 outline-none resize-none transition-all mb-4"
              style={{ 
                border: "2px solid #e5e7eb", 
                fontSize: 16, 
                color: "#1F2937", 
                minHeight: 80, 
                backgroundColor: "white" 
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            /> */}

            {/* Translate Button */}
            <button
              onClick={translateToSign}
              disabled={!recognizedText && !manualInput}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ 
                backgroundColor: "#2563EB", 
                color: "white", 
                fontSize: 16 
              }}
            >
              <Send size={20} />
              {isTranslating ? "Đang dịch..." : "Dịch sang ký hiệu"}
            </button>

            {textToSignError && (
              <div className="mt-3 rounded-2xl p-3" style={{ backgroundColor: "#FEE2E2", border: "1px solid #FCA5A5" }}>
                <p style={{ fontSize: 13, color: "#B91C1C" }}>{textToSignError}</p>
              </div>
            )}

            {/* Sign Animation / Video Display */}
            {(signAnimation || signVideoUrl) && (
              <div className="mt-6 rounded-2xl p-6" style={{ backgroundColor: "#EFF6FF", border: "2px solid #BFDBFE" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Hand size={20} color="#2563EB" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#2563EB" }}>
                    KÝ HIỆU ĐANG HIỂN THỊ
                  </span>
                </div>
                <div 
                  className="rounded-xl p-8 flex flex-col items-center justify-center"
                  style={{ backgroundColor: "#DBEAFE", minHeight: 120 }}
                >
                  {signVideoUrl ? (
                    <video
                      src={signVideoUrl}
                      controls
                      autoPlay
                      muted
                      loop
                      className="w-full max-w-full rounded-2xl"
                      style={{ maxHeight: 320, backgroundColor: "black" }}
                    />
                  ) : (
                    <div className="text-center">
                      <div className="mb-3 animate-bounce">
                        <Hand size={48} color="#2563EB" />
                      </div>
                      <p style={{ fontSize: 18, fontWeight: 700, color: "#1F2937" }}>
                        {signAnimation}
                      </p>
                      <p style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                        [Avatar ký hiệu động sẽ hiển thị tại đây]
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL - Sign Language → Text/Voice */}
          <div className="rounded-3xl p-8 shadow-lg" style={{ backgroundColor: "white" }}>
            <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: "2px solid #F0FDF4" }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#F0FDF4" }}>
                <Camera size={24} color="#16A34A" />
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1F2937" }}>
                  Ký hiệu → Giọng nói
                </h2>
                <p style={{ fontSize: 12, color: "#6B7280" }}>Người khiếm thính</p>
              </div>
            </div>

            {/* Camera Preview Section */}
            <div
              className="rounded-2xl overflow-hidden mb-4 relative"
              style={{ 
                height: 280, 
                backgroundColor: isCameraActive ? "#000000" : "#f8fafc",
                border: "3px solid",
                borderColor: isCameraActive ? "#16A34A" : "#e5e7eb"
              }}
            >
              {isCameraActive ? (
                <div className="w-full h-full relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ backgroundColor: "black" }}
                  />

                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center text-white">
                      <p style={{ fontSize: 16, fontWeight: 700 }}>
                        📹 Camera đang hoạt động
                      </p>
                      <p style={{ fontSize: 13, marginTop: 8 }}>
                        Thực hiện ký hiệu trước camera
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(22, 163, 74, 0.9)" }}>
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>LIVE</span>
                  </div>

                  {isDetecting && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(22, 163, 74, 0.2)" }}>
                      <div className="text-center">
                        <div className="animate-spin mb-3">
                          <RotateCcw size={40} color="#16A34A" />
                        </div>
                        <p style={{ color: "#16A34A", fontSize: 16, fontWeight: 700 }}>
                          Đang nhận dạng...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <CameraOff size={56} color="#D1D5DB" className="mx-auto mb-3" />
                    <p style={{ fontSize: 16, color: "#9CA3AF" }}>Camera chưa bật</p>
                    <p style={{ fontSize: 13, color: "#D1D5DB", marginTop: 4 }}>
                      Nhấn nút bên dưới để kích hoạt
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={toggleCamera}
                className="py-3 rounded-xl font-bold transition-all hover:opacity-90 shadow-md flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: isCameraActive ? "#DC2626" : "#16A34A",
                  color: "white",
                  fontSize: 14
                }}
              >
                {isCameraActive ? <CameraOff size={18} /> : <Camera size={18} />}
                {isCameraActive ? "Tắt Camera" : "Bật Camera"}
              </button>

              <button
                onClick={startDetection}
                disabled={!isCameraActive || isDetecting}
                className="py-3 rounded-xl font-bold transition-all hover:opacity-90 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: "#2563EB",
                  color: "white",
                  fontSize: 14
                }}
              >
                <Hand size={18} />
                {isDetecting ? "Đang nhận dạng..." : "Nhận dạng"}
              </button>
            </div>

            {cameraError && (
              <div className="mb-4 rounded-2xl p-4" style={{ backgroundColor: "#FEE2E2", border: "2px solid #FCA5A5" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#B91C1C" }}>
                  Lỗi camera
                </p>
                <p style={{ fontSize: 13, color: "#991B1B", marginTop: 4 }}>
                  {cameraError}
                </p>
              </div>
            )}

            {signToTextError && (
              <div className="mb-4 rounded-2xl p-4" style={{ backgroundColor: "#FEE2E2", border: "2px solid #FCA5A5" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#B91C1C" }}>
                  Lỗi nhận dạng
                </p>
                <p style={{ fontSize: 13, color: "#991B1B", marginTop: 4 }}>
                  {signToTextError}
                </p>
              </div>
            )}

            {/* Detection Output */}
            {detectedSignText && (
              <div className="mb-4 rounded-2xl p-4" style={{ backgroundColor: "#F0FDF4", border: "2px solid #BBF7D0" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", textTransform: "uppercase" }}>
                    Văn bản nhận dạng
                  </span>
                </div>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#1F2937" }}>
                  {detectedSignText}
                </p>
              </div>
            )}

            {/* Editable Text */}
            <textarea
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              placeholder="Văn bản nhận dạng sẽ hiển thị ở đây và có thể chỉnh sửa..."
              className="w-full rounded-2xl p-4 outline-none resize-none transition-all mb-4"
              style={{ 
                border: "2px solid #e5e7eb", 
                fontSize: 16, 
                color: "#1F2937", 
                minHeight: 80, 
                backgroundColor: "white" 
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#16A34A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            />

            {/* Play Voice Button */}
            <button
              onClick={playVoice}
              disabled={!editableText}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ 
                backgroundColor: isSpeaking ? "#16A34A" : "#2563EB", 
                color: "white", 
                fontSize: 16 
              }}
            >
              <Volume2 size={20} />
              {isSpeaking ? "Đang phát giọng nói..." : "Phát giọng nói"}
            </button>
          </div>
        </div>

        {/* QUICK PHRASES SECTION */}
        {/* <div className="rounded-3xl p-6 shadow-lg mb-6" style={{ backgroundColor: "white" }}>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={20} color="#7C3AED" />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937" }}>
              Cụm từ nhanh
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {QUICK_PHRASES.map((phrase) => (
              <button
                key={phrase}
                onClick={() => handleQuickPhrase(phrase)}
                className="px-4 py-3 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 shadow-md"
                style={{
                  backgroundColor: "#F5F3FF",
                  color: "#7C3AED",
                  fontWeight: 600,
                  border: "2px solid #E9D5FF",
                }}
              >
                {phrase}
              </button>
            ))}
          </div>
        </div> */}

        {/* CONVERSATION HISTORY */}
        <div className="rounded-3xl p-6 shadow-lg" style={{ backgroundColor: "white" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", marginBottom: 16 }}>
            📜 Lịch sử hội thoại
          </h3>
          
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={48} color="#D1D5DB" className="mx-auto mb-3" />
              <p style={{ fontSize: 14, color: "#9CA3AF" }}>
                Chưa có hội thoại nào. Bắt đầu giao tiếp ngay!
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-2xl p-4 transition-all hover:shadow-md"
                  style={{ 
                    backgroundColor: msg.type === "voice" ? "#EFF6FF" : "#F0FDF4",
                    border: "2px solid",
                    borderColor: msg.type === "voice" ? "#BFDBFE" : "#BBF7D0"
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: msg.type === "voice" ? "#2563EB" : "#16A34A" }}
                      >
                        {msg.type === "voice" ? (
                          <User size={16} color="white" />
                        ) : (
                          <Hand size={16} color="white" />
                        )}
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: msg.type === "voice" ? "#2563EB" : "#16A34A" }}>
                          {msg.type === "voice" ? "NGƯỜI NGHE" : "NGƯỜI KHIẾM THÍNH"}
                        </p>
                        <p style={{ fontSize: 10, color: "#9CA3AF" }}>
                          {msg.timestamp.toLocaleTimeString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => replayMessage(msg)}
                      className="p-2 rounded-lg transition-all hover:bg-white"
                      style={{ color: "#6B7280" }}
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4 }}>
                        Đầu vào:
                      </p>
                      <p style={{ fontSize: 15, color: "#1F2937" }}>
                        {msg.original}
                      </p>
                    </div>
                    <div className="pt-2" style={{ borderTop: "1px dashed #E5E7EB" }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4 }}>
                        Dịch sang:
                      </p>
                      <p style={{ fontSize: 15, color: "#1F2937", fontWeight: 600 }}>
                        {msg.translated}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

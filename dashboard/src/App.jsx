// App.js - Main React Component
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Text, Html, Sky, Plane, Box } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import './App.css';

// 3D Building Components
function HRBuilding() {
  return (
    <group position={[0, -1, 0]}>
      {/* Main Building */}
      <mesh castShadow receiveShadow position={[0, 1, 0]}>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.5} roughness={0.2} />
      </mesh>
      
      {/* Building Roof */}
      <mesh castShadow position={[0, 2.5, 0]}>
        <coneGeometry args={[2.2, 0.5, 4]} />
        <meshStandardMaterial color="#3498db" metalness={0.3} roughness={0.4} />
      </mesh>
      
      {/* Windows */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <group key={i}>
          <mesh castShadow position={[x, 1.2, 1.51]}>
            <boxGeometry args={[0.4, 0.6, 0.05]} />
            <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.3} />
          </mesh>
          <mesh castShadow position={[1.51, 1.2, x]}>
            <boxGeometry args={[0.05, 0.6, 0.4]} />
            <meshStandardMaterial color="#3498db" emissive="#3498db" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
      
      {/* Logo Sign */}
      <mesh position={[0, 3, 1.6]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshStandardMaterial color="#e74c3c" side={THREE.DoubleSide} />
      </mesh>
      
      <Text
        position={[0, 3, 1.61]}
        rotation={[0, 0, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        PrudentHR
      </Text>
    </group>
  );
}

function FloatingService({ position, title, icon, color, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group position={position} ref={meshRef}>
        <mesh 
          castShadow 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
          scale={hovered ? 1.2 : 1}
        >
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        <Html position={[0, 1, 0]} center>
          <div className="service-tooltip">
            <h4>{title}</h4>
            <i className={`fas fa-${icon}`}></i>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function AnimatedStat({ position, value, label, delay }) {
  const meshRef = useRef();
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = value / 50;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          current = value;
          clearInterval(interval);
        }
        setDisplayValue(Math.floor(current));
      }, 30);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 8]} />
        <meshStandardMaterial color="#3498db" metalness={0.7} roughness={0.3} />
      </mesh>
      
      <Html position={[0, 0.6, 0]} center>
        <div className="stat-display">
          <div className="stat-number">{displayValue}+</div>
          <div className="stat-label">{label}</div>
        </div>
      </Html>
    </group>
  );
}

function InteractiveCharacter({ position, type, name, role }) {
  const meshRef = useRef();
  const [animation, setAnimation] = useState('idle');
  
  useFrame((state) => {
    if (meshRef.current) {
      if (animation === 'float') {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      }
    }
  });
  
  const getColor = () => {
    switch(type) {
      case 'consultant': return '#3498db';
      case 'client': return '#2ecc71';
      case 'manager': return '#9b59b6';
      default: return '#e74c3c';
    }
  };
  
  return (
    <group 
      position={position}
      ref={meshRef}
      onPointerEnter={() => setAnimation('float')}
      onPointerLeave={() => setAnimation('idle')}
    >
      <mesh castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={getColor()} roughness={0.4} />
      </mesh>
      
      <mesh castShadow position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.6, 8]} />
        <meshStandardMaterial color={getColor()} roughness={0.6} />
      </mesh>
      
      <Html position={[0, 1.2, 0]} center>
        <div className="character-info">
          <strong>{name}</strong>
          <small>{role}</small>
        </div>
      </Html>
    </group>
  );
}

function FloatingText({ position, content, size = 0.5 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  
  return (
    <Text
      ref={meshRef}
      position={position}
      fontSize={size}
      color="#2c3e50"
      maxWidth={5}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
      font="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
    >
      {content}
    </Text>
  );
}

function ContactForm3D({ position, isVisible, onClose }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.y += 0.005;
    }
  });
  
  if (!isVisible) return null;
  
  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="white" roughness={0.8} />
      </mesh>
      
      <Html transform position={[0, 0, 0.06]}>
        <div className="contact-form-3d">
          <h3>Contact Us</h3>
          <form>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Your Message" rows="3"></textarea>
            <button type="submit" className="btn-3d">Send</button>
            <button type="button" onClick={onClose} className="btn-3d-close">Close</button>
          </form>
        </div>
      </Html>
    </group>
  );
}

function Scene() {
  const [activeSection, setActiveSection] = useState('home');
  const [showContactForm, setShowContactForm] = useState(false);
  
  const services = [
    { title: 'Talent Acquisition', icon: 'users', color: '#3498db', position: [-4, 2, -3] },
    { title: 'Training', icon: 'graduation-cap', color: '#2ecc71', position: [-2, 3, -4] },
    { title: 'Compensation', icon: 'money-bill-wave', color: '#f39c12', position: [2, 2.5, -4] },
    { title: 'Compliance', icon: 'balance-scale', color: '#9b59b6', position: [4, 2, -3] },
    { title: 'Performance', icon: 'chart-line', color: '#e74c3c', position: [-3, 1.5, 4] },
    { title: 'HR Tech', icon: 'laptop-code', color: '#1abc9c', position: [3, 1.8, 4] }
  ];
  
  const stats = [
    { value: 250, label: 'Clients', position: [-6, 0.5, 0] },
    { value: 500, label: 'Projects', position: [-2, 0.5, 6] },
    { value: 50, label: 'Experts', position: [2, 0.5, 6] },
    { value: 15, label: 'Years', position: [6, 0.5, 0] }
  ];
  
  const characters = [
    { type: 'consultant', name: 'Sarah', role: 'HR Expert', position: [-5, 0, -5] },
    { type: 'client', name: 'Amit', role: 'CEO, Jain Steels', position: [5, 0, -5] },
    { type: 'manager', name: 'Lisa', role: 'HR Director', position: [-5, 0, 5] }
  ];
  
  return (
    <>
      {/* Environment */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <directionalLight position={[-5, 10, 5]} intensity={0.5} castShadow />
      
      {/* Sky and Ground */}
      <Sky distance={450000} sunPosition={[100, 20, 100]} inclination={0} azimuth={0.25} />
      <Plane rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} args={[100, 100]}>
        <meshStandardMaterial color="#ecf0f1" roughness={1} />
      </Plane>
      
      {/* Main Building */}
      <HRBuilding />
      
      {/* Navigation Points */}
      <group>
        {['home', 'about', 'services', 'stats', 'testimonials', 'contact'].map((section, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const radius = 8;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          
          return (
            <mesh 
              key={section}
              position={[x, 0, z]}
              onClick={() => setActiveSection(section)}
              onPointerEnter={() => document.body.style.cursor = 'pointer'}
              onPointerLeave={() => document.body.style.cursor = 'default'}
            >
              <cylinderGeometry args={[0.5, 0.5, 0.1, 8]} />
              <meshStandardMaterial 
                color={activeSection === section ? '#e74c3c' : '#3498db'} 
                emissive={activeSection === section ? '#e74c3c' : '#3498db'}
                emissiveIntensity={0.3}
              />
              
              <Html position={[0, 1, 0]} center>
                <div className="nav-marker">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </div>
              </Html>
            </mesh>
          );
        })}
      </group>
      
      {/* Floating Services */}
      {services.map((service, i) => (
        <FloatingService
          key={i}
          {...service}
          onClick={() => {
            setActiveSection('services');
            // You could add more specific service selection here
          }}
        />
      ))}
      
      {/* Animated Stats */}
      {stats.map((stat, i) => (
        <AnimatedStat key={i} {...stat} delay={i * 500} />
      ))}
      
      {/* Interactive Characters */}
      {characters.map((char, i) => (
        <InteractiveCharacter key={i} {...char} />
      ))}
      
      {/* Section Titles */}
      <FloatingText 
        position={[0, 5, -10]} 
        content="PrudentHR - Strategic HR Solutions"
        size={0.8}
      />
      
      {/* Contact Form */}
      <ContactForm3D 
        position={[0, 3, 0]}
        isVisible={showContactForm}
        onClose={() => setShowContactForm(false)}
      />
      
      {/* Call to Action */}
      <mesh 
        position={[0, 0.5, -8]}
        onClick={() => setShowContactForm(true)}
        onPointerEnter={() => document.body.style.cursor = 'pointer'}
        onPointerLeave={() => document.body.style.cursor = 'default'}
      >
        <boxGeometry args={[3, 1, 0.5]} />
        <meshStandardMaterial 
          color="#e74c3c"
          emissive="#e74c3c"
          emissiveIntensity={0.3}
        />
        
        <Html position={[0, 0, 0.26]} center>
          <div className="cta-button">
            <h3>Get Started Today!</h3>
            <p>Click to contact us</p>
          </div>
        </Html>
      </mesh>
      
      {/* Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        autoRotate={activeSection === 'home'}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// UI Overlay Component
function UIOverlay({ activeSection, setActiveSection }) {
  return (
    <div className="ui-overlay">
      <header className="header-3d">
        <div className="logo-3d">
          <i className="fas fa-users"></i>
          <h1>Prudent<span>HR</span></h1>
        </div>
        <nav className="nav-3d">
          {['home', 'about', 'services', 'stats', 'testimonials', 'contact'].map(section => (
            <button
              key={section}
              className={`nav-btn ${activeSection === section ? 'active' : ''}`}
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </nav>
      </header>
      
      <div className="info-panel">
        <h2>Explore in 3D</h2>
        <p>Click on objects to interact • Drag to rotate • Scroll to zoom</p>
        <div className="controls-info">
          <div className="control-item">
            <i className="fas fa-mouse-pointer"></i>
            <span>Click objects</span>
          </div>
          <div className="control-item">
            <i className="fas fa-arrows-alt"></i>
            <span>Drag to rotate</span>
          </div>
          <div className="control-item">
            <i className="fas fa-search"></i>
            <span>Scroll to zoom</span>
          </div>
        </div>
      </div>
      
      <div className="section-content">
        {activeSection === 'home' && (
          <div className="content-card">
            <h3>Welcome to PrudentHR 3D</h3>
            <p>Explore our virtual HR headquarters. Click on floating service orbs to learn more about our offerings.</p>
          </div>
        )}
        
        {activeSection === 'services' && (
          <div className="content-card">
            <h3>Our 3D Services</h3>
            <p>Each floating orb represents a different HR service. Hover over them to see details.</p>
            <div className="service-list">
              <div className="service-item"><i className="fas fa-users"></i> Talent Acquisition</div>
              <div className="service-item"><i className="fas fa-graduation-cap"></i> Training & Development</div>
              <div className="service-item"><i className="fas fa-money-bill-wave"></i> Compensation & Benefits</div>
              <div className="service-item"><i className="fas fa-balance-scale"></i> HR Compliance</div>
              <div className="service-item"><i className="fas fa-chart-line"></i> Performance Management</div>
              <div className="service-item"><i className="fas fa-laptop-code"></i> HR Technology</div>
            </div>
          </div>
        )}
        
        {activeSection === 'stats' && (
          <div className="content-card">
            <h3>Our Impact in Numbers</h3>
            <p>Each rotating cylinder displays our achievements. Watch the numbers animate!</p>
          </div>
        )}
      </div>
      
      <div className="bottom-bar">
        <button className="btn-3d-ui" onClick={() => window.open('tel:+919990938987')}>
          <i className="fas fa-phone"></i> Call Now
        </button>
        <button className="btn-3d-ui primary" onClick={() => {/* Show contact form */}}>
          <i className="fas fa-envelope"></i> Contact Us
        </button>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState('home');
  
  return (
    <div className="app-container">
      <Canvas
        shadows
        camera={{ position: [10, 5, 10], fov: 60 }}
        className="three-canvas"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      <UIOverlay activeSection={activeSection} setActiveSection={setActiveSection} />
    </div>
  );
}

export default App;
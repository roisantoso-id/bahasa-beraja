import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe } from 'lucide-react';
import UpdateManager from '../utils/updateManager';

const GOLD_GRADIENT = 'linear-gradient(135deg, #f7d774 0%, #fff 100%)';
const GOLD = '#f7d774';
const GOLD_DARK = '#b48a4a';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const ModalHeader = styled.div`
  background: ${GOLD_GRADIENT};
  padding: 30px;
  color: white;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const LanguageToggle = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: white;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ModalTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const ModalSubtitle = styled.p`
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;
`;

const VersionBadge = styled.div`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 15px;
`;

const ModalContent = styled.div`
  padding: 30px;
  max-height: 60vh;
  overflow-y: auto;
`;

const UpdatesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UpdateItem = styled(motion.div)`
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 15px;
  border-left: 4px solid ${GOLD};
  transition: all 0.3s ease;

  &:hover {
    background: #f1f5f9;
    transform: translateX(5px);
  }
`;

const UpdateIcon = styled.div`
  font-size: 24px;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const UpdateContent = styled.div`
  flex: 1;
`;

const UpdateTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${GOLD_DARK};
  margin: 0 0 8px 0;
`;

const UpdateDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

const ModalFooter = styled.div`
  padding: 20px 30px;
  background: #f8fafc;
  text-align: center;
  border-top: 1px solid #e1e5e9;
`;

const QRSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
`;

const QRRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 32px;
`;

const QRBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WeChatQR = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  margin-bottom: 8px;
  background: #fff;
`;

const WhatsAppQR = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  margin-bottom: 8px;
  background: #fff;
`;

const QRLabel = styled.div`
  font-size: 15px;
  color: #333;
  font-weight: 500;
  text-align: center;
`;

const FooterText = styled.p`
  font-size: 16px;
  color: ${GOLD};
  font-weight: 600;
  margin: 0 0 20px 0;
`;

const ActionButton = styled.button`
  background: ${GOLD_GRADIENT};
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(180, 138, 74, 0.18);
  }
`;

function UpdateModal({ isOpen, onClose }) {
  const [language, setLanguage] = useState('chinese'); // 'chinese' or 'indonesian'
  const updateContent = UpdateManager.getUpdateContent();

  const toggleLanguage = () => {
    setLanguage(language === 'chinese' ? 'indonesian' : 'chinese');
  };

  const handleClose = () => {
    UpdateManager.markUpdateModalShown();
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContainer
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <LanguageToggle onClick={toggleLanguage}>
                <Globe size={16} />
                {language === 'chinese' ? '中文' : 'ID'}
              </LanguageToggle>
              
              <CloseButton onClick={handleClose}>
                <X size={20} />
              </CloseButton>
              
              <ModalTitle>{updateContent.title[language]}</ModalTitle>
              <ModalSubtitle>{updateContent.subtitle[language]}</ModalSubtitle>
              <VersionBadge>Version {updateContent.version}</VersionBadge>
            </ModalHeader>

            <ModalContent>
              <UpdatesList>
                {updateContent.updates.map((update, index) => (
                  <UpdateItem
                    key={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <UpdateIcon>{update.icon}</UpdateIcon>
                    <UpdateContent>
                      <UpdateTitle>{update.title[language]}</UpdateTitle>
                      <UpdateDescription>{update.description[language]}</UpdateDescription>
                    </UpdateContent>
                  </UpdateItem>
                ))}
              </UpdatesList>
            </ModalContent>

            <ModalFooter>
              <QRSection>
                <QRRow>
                  <QRBlock>
                    <WeChatQR src={require('../assets/wechat_group.jpg')} alt="微信群二维码" />
                    <QRLabel>
                      微信社群<br/>Scan to join WeChat group<br/>
                      <span style={{ color: '#888', fontSize: '13px' }}>
                        {language === 'chinese' ? '推荐微信扫码加入' : 'Disarankan scan dengan WeChat'}
                      </span>
                    </QRLabel>
                  </QRBlock>
                  <QRBlock>
                    <WhatsAppQR src="/whatsapp-group.jpg" alt="WhatsApp群二维码" />
                    <QRLabel>
                      WhatsApp社群<br/>WhatsApp Group<br/>
                      <span style={{ color: '#888', fontSize: '13px' }}>
                        {language === 'chinese' ? '点击下方按钮加入' : 'Klik tombol di bawah untuk bergabung'}
                      </span>
                    </QRLabel>
                  </QRBlock>
                </QRRow>
              </QRSection>
              <FooterText>{updateContent.footer[language]}</FooterText>
              <ActionButton onClick={handleClose}>
                {language === 'chinese' ? '开始体验' : 'Mulai Pengalaman'}
              </ActionButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
}

export default UpdateModal; 
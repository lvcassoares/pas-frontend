import React from 'react';

const footerStyle = {
  textAlign: 'center',
  padding: '1rem',
  marginTop: '2rem',
  backgroundColor: '#f8f9fa',
  borderTop: '1px solid #e7e7e7',
  position: 'relative',
  bottom: 0,
  width: '100%'
};

const Footer = () => (
  <footer style={footerStyle}>
    <p>© 2024 Portal Educacional. Todos os direitos reservados.</p>
  </footer>
);

export default Footer;
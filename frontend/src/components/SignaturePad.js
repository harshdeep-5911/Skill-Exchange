import React, { useEffect, useRef, useState } from 'react';
import SignaturePad from 'signature_pad';

const SignaturePadComponent = ({ onSave }) => {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    signaturePadRef.current = new SignaturePad(canvasRef.current);

    signaturePadRef.current.onEnd = () => {
      setIsSigned(true);
    };
  }, []);

  const clearSignature = () => {
    signaturePadRef.current.clear();
    setIsSigned(false);
  };

  const saveSignature = () => {
    const signatureData = signaturePadRef.current.toDataURL();
    onSave(signatureData);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Sign the Agreement</h2>
      <canvas
        ref={canvasRef}
        width="400"
        height="200"
        style={{ border: '1px solid #000', backgroundColor: '#fff' }}
      ></canvas>
      <div>
        <button onClick={clearSignature}>Clear</button>
        <button onClick={saveSignature} disabled={!isSigned}>
          Save Signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePadComponent;

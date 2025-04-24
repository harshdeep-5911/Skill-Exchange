import React, { useState } from 'react';
import SignaturePadComponent from './SignaturePad';  // Path to SignaturePadComponent
import AgreementTemplate from './AgreementTemplate';  // Path to AgreementTemplate if it's a separate component

const AgreementPage = () => {
  const [signature1, setSignature1] = useState(null);
  const [signature2, setSignature2] = useState(null);

  const handleSignatureSave = (signatureData, party) => {
    if (party === 1) {
      setSignature1(signatureData);
    } else if (party === 2) {
      setSignature2(signatureData);
    }
  };

  const handleSubmitAgreement = () => {
    if (!signature1 || !signature2) {
      alert('Both parties must sign the agreement.');
      return;
    }

    // Submit the agreement with signatures (e.g., save them to the backend)
    console.log('Agreement Signed:', { signature1, signature2 });
    // You can proceed with saving this data or performing other actions here.
  };

  return (
    <div>
      <h1>Skill Exchange Agreement</h1>
      <AgreementTemplate />
      
      <h3>Party 1 - Freelancer Signature</h3>
      <SignaturePadComponent onSave={(signature) => handleSignatureSave(signature, 1)} />

      <h3>Party 2 - Client Signature</h3>
      <SignaturePadComponent onSave={(signature) => handleSignatureSave(signature, 2)} />
      
      <div>
        <button onClick={handleSubmitAgreement}>Submit Agreement</button>
      </div>
    </div>
  );
};

export default AgreementPage;

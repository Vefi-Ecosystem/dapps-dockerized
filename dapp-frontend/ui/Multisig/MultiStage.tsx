import React, { useState } from 'react';
import MultiStart from './MultiStart';
import AknowledgeCard from './AknowledgeCard';

export default function MultiStage() {
  const [showMultiStart, setShowMultiStart] = useState(false);

  const handleAgreeAndContinue = () => {
    setShowMultiStart(true);
  };

  return <>{showMultiStart ? <MultiStart /> : <AknowledgeCard onAgreeAndContinue={handleAgreeAndContinue} />}</>;
}

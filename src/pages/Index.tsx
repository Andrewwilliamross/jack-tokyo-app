import React, { useEffect, useState } from 'react';
import { MissionControl } from '../components/MissionControl';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const modalParam = searchParams.get('modal');
    if (modalParam === 'new') {
      setShowModal(true);
    }
  }, [searchParams]);

  const handleModalClose = () => {
    setShowModal(false);
    // Remove the modal parameter from the URL
    navigate('/', { replace: true });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <MissionControl showModal={showModal} onModalClose={handleModalClose} />
    </div>
  );
};

export default Index;

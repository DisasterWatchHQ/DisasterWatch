import React from 'react';
import AddGuideModal from './AddGuideModal';
import AddContactModal from './AddContactModal';
import AddFacilityModal from './AddFacilityModal';

const ResourceModals = ({ 
  visibleModal, 
  onDismiss, 
  onSubmit 
}) => {
  return (
    <>
      <AddGuideModal
        visible={visibleModal === 'guide'}
        onDismiss={onDismiss}
        onSubmit={(data) => onSubmit('guide', data)}
      />
      <AddContactModal
        visible={visibleModal === 'contact'}
        onDismiss={onDismiss}
        onSubmit={(data) => onSubmit('contact', data)}
      />
      <AddFacilityModal
        visible={visibleModal === 'facility'}
        onDismiss={onDismiss}
        onSubmit={(data) => onSubmit('facility', data)}
      />
    </>
  );
};

export default ResourceModals;
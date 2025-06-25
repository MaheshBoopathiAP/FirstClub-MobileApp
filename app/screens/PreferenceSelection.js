import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Page1 from './preferenceSelections/Page1';
import Page2 from './preferenceSelections/Page2';
import Page3 from './preferenceSelections/Page3';

const PreferenceSelection = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const goBack = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 1: return <Page1 onNext={() => setCurrentPage(2)} onBack={goBack} />;
      case 2: return <Page2 onNext={() => setCurrentPage(3)} onBack={goBack} />;
      case 3: return <Page3 onBack={goBack} />;
      default: return <Page1 onNext={() => setCurrentPage(2)} onBack={goBack} />;
    }
  };

  return <View style={styles.container}>{renderPage()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PreferenceSelection;
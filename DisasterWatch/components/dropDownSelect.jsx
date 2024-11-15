import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const DropdownSelect = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ]);

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select an option..."
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        
      />
      {value ? <Text style={styles.result}>Selected: {value}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginBottom: 10 },
  dropdown: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdownContainer: {
    borderColor: 'gray',
  },
  result: { marginTop: 20, fontWeight: 'bold' },
});

export default DropdownSelect;

import React, { useState } from "react";
import { View, Button, Share, Linking, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const handleShare = async (report) => {
  try {
    const shareText = `${report.title} - ${report.description}`;
    await Share.share({
      message: shareText,
      title: report.title,
    });
  } catch (error) {
    console.error("Error sharing report:", error);
  }
};

const handleSocialShare = async (report, platform) => {
  const shareText = encodeURIComponent(
    `${report.title} - ${report.description}`,
  );

  switch (platform) {
    case "twitter":
      await Linking.openURL(
        `https://twitter.com/intent/tweet?text=${shareText}`,
      );
      break;
    case "facebook":
      await Linking.openURL(
        `https://www.facebook.com/sharer/sharer.php?u=${shareText}`,
      );
      break;
    case "whatsapp":
      await Linking.openURL(`whatsapp://send?text=${shareText}`);
      break;
  }
};

export default function DisasterFeed() {
  const report = { title: "Disaster Alert", description: "A flood has occurred" };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Disaster Feed</Text>
      <Button
        title="Share Report"
        onPress={() => handleShare(report)}
      />
      <Button
        title="Share on Twitter"
        onPress={() => handleSocialShare(report, "twitter")}
      />
      <Button
        title="Share on Facebook"
        onPress={() => handleSocialShare(report, "facebook")}
      />
      <Button
        title="Share on WhatsApp"
        onPress={() => handleSocialShare(report, "whatsapp")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
});

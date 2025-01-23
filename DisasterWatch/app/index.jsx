export default function WelcomePage() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push("/Landingpage");
    });
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#262626" }}>
      <StatusBar style="light" backgroundColor="#262626" />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          minHeight: height * 0.85,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={{ marginBottom: 32, alignItems: "center" }}>
            <Text
              variant="headlineSmall"
              style={{
                color: "#f5f5f5",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Welcome to
            </Text>
            <Text
              variant="displayMedium"
              style={{
                color: "#f5f5f5",
                fontWeight: "800",
                textAlign: "center",
              }}
            >
              Disaster Watch
            </Text>
          </View>

          <Text
            variant="bodyLarge"
            style={{
              color: "#a3a3a3",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Stay informed and prepared for natural disasters in your area
          </Text>

          <View style={{ width: "100%", gap: 16 }}>
            <Button
              mode="contained"
              onPress={handleGetStarted}
              contentStyle={{
                height: 50,
              }}
              style={{
                borderRadius: 12,
              }}
              labelStyle={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Get Started
            </Button>

            <Button
              mode="outlined"
              onPress={() => {
                /* navigation to info page */
              }}
              contentStyle={{
                height: 50,
              }}
              style={{
                borderRadius: 12,
                borderWidth: 2,
                borderColor: "#a3a3a3",
              }}
              labelStyle={{
                fontSize: 18,
                fontWeight: "600",
                color: "#f5f5f5",
              }}
            >
              Learn More
            </Button>
            <Button
              mode="outlined"
              onPress={() => router.push("/signIn")}
              contentStyle={{
                height: 50,
              }}
              style={{
                borderRadius: 12,
                borderWidth: 2,
                borderColor: "#a3a3a3",
              }}
              labelStyle={{
                fontSize: 18,
                fontWeight: "600",
                color: "#f5f5f5",
              }}
            >
              Sign In
            </Button>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

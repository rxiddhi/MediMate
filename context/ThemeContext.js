import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useColorScheme } from "react-native";
import storageService from "../services/storageService";

const ThemeContext = createContext();

// Professional Healthcare Light Theme
export const lightTheme = {
  mode: "light",
  colors: {
    // Primary - Modern Vibrant Purple
    primary: "#7C3AED",
    primaryLight: "#9F7CFF",
    primaryDark: "#5A2DB8",

    // Secondary - Vibrant Orange
    secondary: "#F97316",
    secondaryLight: "#FFB78A",
    secondaryDark: "#C55A0C",

    // Backgrounds
    background: "#F8FAFF",
    backgroundAlt: "#FFFFFF",
    surface: "#FFFFFF",
    card: "#FFFFFF",

    // Text Colors
    text: "#11121A",
    textSecondary: "#6F7787",
    textTertiary: "#9EA4B3",
    textInverse: "#FFFFFF",

    // Borders & Dividers
    border: "#E7EBFF",
    borderLight: "#F3F6FF",
    divider: "#EAECEF",

    // Status Colors
    success: "#06B6D4",
    successLight: "#E6F7F0",
    error: "#E63946",
    errorLight: "#FDEAEC",
    warning: "#F97316",
    warningLight: "#FFF4E6",
    info: "#7C3AED",
    infoLight: "#F0E9FF",

    // Healthcare Specific
    urgent: "#E63946",
    prescription: "#8B5CF6",
    appointment: "#7C3AED",
    vitals: "#06B6D4",

    // UI Elements
    disabled: "#D1D5DB",
    placeholder: "#9EA4B3",
    shadow: "rgba(124, 58, 237, 0.08)",
    overlay: "rgba(0, 0, 0, 0.5)",

    // Gradients
    gradientStart: "#7C3AED",
    gradientEnd: "#06B6D4",
  },
};

// Professional Healthcare Dark Theme - TRUE BLACK (#000) with depth
export const darkTheme = {
  mode: "dark",
  colors: {
    // Primary - Vibrant Purple tuned for dark
    primary: "#9F7CFF",
    primaryLight: "#BFAEFF",
    primaryDark: "#7C3AED",

    // Secondary - Vibrant Orange accents
    secondary: "#F97316",
    secondaryLight: "#FFB78A",
    secondaryDark: "#C55A0C",

    // Backgrounds - TRUE BLACK with subtle layers
    background: "#000000",
    backgroundAlt: "#07060A",
    surface: "#0F0F10",
    card: "#141217",

    // Text Colors - softer whites
    text: "#F4F3FF",
    textSecondary: "#B9B3D9",
    textTertiary: "#8A889A",
    textInverse: "#0A0A0A",

    // Borders & Dividers - subtle in dark
    border: "#1B1A2A",
    borderLight: "#0F0E14",
    divider: "#1E1D28",

    // Status Colors (vibrant for dark)
    success: "#06B6D4",
    successLight: "#06384A",
    error: "#FF6B6B",
    errorLight: "#3D1F21",
    warning: "#F97316",
    warningLight: "#3D2F1F",
    info: "#9F7CFF",
    infoLight: "#2A2333",

    // Healthcare Specific
    urgent: "#FF7B7B",
    prescription: "#B39DFF",
    appointment: "#9F7CFF",
    vitals: "#06B6D4",

    // UI Elements
    disabled: "#303033",
    placeholder: "#50505A",
    shadow: "rgba(124, 58, 237, 0.16)", // Deeper tinted shadow
    overlay: "rgba(0, 0, 0, 0.85)",

    // Gradients
    gradientStart: "#9F7CFF",
    gradientEnd: "#06B6D4",
  },
};

const initialState = {
  theme: lightTheme,
  isDark: false,
  isSystemTheme: true,
};

const themeReducer = (state, action) => {
  switch (action.type) {
    case "SET_LIGHT_THEME":
      return {
        ...state,
        theme: lightTheme,
        isDark: false,
        isSystemTheme: false,
      };
    case "SET_DARK_THEME":
      return { ...state, theme: darkTheme, isDark: true, isSystemTheme: false };
    case "TOGGLE_THEME":
      return {
        ...state,
        theme: state.isDark ? lightTheme : darkTheme,
        isDark: !state.isDark,
        isSystemTheme: false,
      };
    case "SET_SYSTEM_THEME":
      return {
        ...state,
        theme: action.payload ? darkTheme : lightTheme,
        isDark: action.payload,
        isSystemTheme: true,
      };
    case "LOAD_THEME":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// Typography scale - HUMAN-CHOSEN, breathing room included
export const typography = {
  fontSizes: {
    xs: 11, // Tiny hints, barely there
    sm: 13, // Small labels, secondary info
    base: 15, // Body text - comfortable reading
    md: 17, // Emphasized body
    lg: 19, // Section headers
    xl: 22, // Card titles
    "2xl": 26, // Screen titles
    "3xl": 30, // Big greetings
    "4xl": 34, // Hero text
    "5xl": 38, // Rare, special moments
  },
  fontWeights: {
    regular: "400",
    medium: "500", // Labels that matter
    semibold: "600", // Values, emphasis
    bold: "700", // Headlines, CTAs
  },
  // Real line heights - gives text room to breathe
  lineHeights: {
    tight: 1.25, // Compact headlines
    snug: 1.4, // Comfortable labels
    normal: 1.5, // Body text default
    relaxed: 1.6, // Long-form reading
    loose: 1.75, // Spacious, calm
  },
  // Letter spacing - subtle but human
  letterSpacing: {
    tighter: -0.4, // Headlines, bold text
    tight: -0.2, // Titles
    normal: 0, // Default
    wide: 0.3, // Breathing labels
    wider: 0.5, // Uppercase, accessibility
  },
};

// Spacing scale - NOT uniform on purpose! Intentional variety.
export const spacing = {
  xxs: 2, // Hairline gaps
  xs: 6, // Tiny breathing room
  sm: 10, // Compact spacing
  md: 14, // Default comfortable
  base: 18, // Generous default
  lg: 22, // Sections apart
  xl: 28, // Screen edges
  "2xl": 36, // Major sections
  "3xl": 48, // Dramatic separation
  "4xl": 64, // Hero spacing
};

// Border radius - IMPERFECT by design, like hand-drawn
export const borderRadius = {
  xs: 8, // Subtle softness
  sm: 14, // Buttons, small cards
  md: 18, // Main cards
  lg: 24, // Large cards, modals
  xl: 32, // Heroic elements
  "2xl": 36, // Big personality
  pill: 100, // Full pill shape
  circle: 9999, // Perfect circles
};

// Shadows - depth that feels ALIVE, not flat
export const shadows = {
  // Barely there - floating whisper
  subtle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  // Soft lift - cards at rest
  soft: {
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  // Medium - interactive elements
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  // Strong - focus, emphasis
  strong: {
    shadowColor: "#0066CC",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  // Dramatic - modals, overlays
  dramatic: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 10,
  },
  // Glow - success, positive feedback
  glow: {
    shadowColor: "#00A86B",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
};

// Animation timings - feels natural, not robotic
export const animations = {
  // Durations in ms
  instant: 150, // Immediate feedback
  quick: 200, // Snappy transitions
  normal: 300, // Default feel
  smooth: 400, // Graceful movement
  slow: 500, // Deliberate, important
  gentle: 700, // Calm, reassuring

  // Spring configs - bouncy, alive!
  spring: {
    gentle: { tension: 120, friction: 14 }, // Soft bounce
    playful: { tension: 180, friction: 12 }, // Fun bounce
    snappy: { tension: 250, friction: 18 }, // Quick snap
  },

  // Easing curves
  easing: {
    easeOut: [0.25, 0.1, 0.25, 1], // Natural deceleration
    easeInOut: [0.42, 0, 0.58, 1], // Smooth both ways
    bounce: [0.68, -0.55, 0.265, 1.55], // Playful overshoot
  },
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const systemColorScheme = useColorScheme();

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Update theme when system theme changes (if using system theme)
  useEffect(() => {
    if (state.isSystemTheme) {
      dispatch({
        type: "SET_SYSTEM_THEME",
        payload: systemColorScheme === "dark",
      });
    }
  }, [systemColorScheme, state.isSystemTheme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await storageService.getTheme();

      if (savedTheme === "system") {
        dispatch({
          type: "SET_SYSTEM_THEME",
          payload: systemColorScheme === "dark",
        });
      } else if (savedTheme === "dark") {
        dispatch({ type: "SET_DARK_THEME" });
      } else {
        dispatch({ type: "SET_LIGHT_THEME" });
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const setLightTheme = async () => {
    dispatch({ type: "SET_LIGHT_THEME" });
    await storageService.saveTheme("light");
  };

  const setDarkTheme = async () => {
    dispatch({ type: "SET_DARK_THEME" });
    await storageService.saveTheme("dark");
  };

  const toggleTheme = async () => {
    const newTheme = state.isDark ? "light" : "dark";
    dispatch({ type: "TOGGLE_THEME" });
    await storageService.saveTheme(newTheme);
  };

  const setSystemTheme = async () => {
    dispatch({
      type: "SET_SYSTEM_THEME",
      payload: systemColorScheme === "dark",
    });
    await storageService.saveTheme("system");
  };

  const value = {
    theme: state.theme,
    isDark: state.isDark,
    isSystemTheme: state.isSystemTheme,
    setLightTheme,
    setDarkTheme,
    toggleTheme,
    setSystemTheme,
    // Design tokens - the soul of the app
    typography,
    spacing,
    borderRadius,
    shadows,
    animations,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

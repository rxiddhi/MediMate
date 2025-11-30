import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useMedicine } from '../context/MedicineContext';
import { useTheme } from '../context/ThemeContext';

const HistoryScreen = () => {
    const { medicineHistory, loadMedicineHistory } = useMedicine();
    const { theme } = useTheme();

    useFocusEffect(
        useCallback(() => {
            loadMedicineHistory();
        }, [])
    );

    const sortedDates = Object.keys(medicineHistory || {}).sort().reverse();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.header, { color: theme.colors.text }]}>History</Text>

            {sortedDates.length === 0 && (
                <View style={styles.emptyBox}>
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No history yet</Text>
                </View>
            )}

            {sortedDates.map(date => (
                <View key={date} style={[styles.card, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.date, { color: theme.colors.text }]}>{date}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={[styles.takenNumber, { color: theme.colors.success }]}>{medicineHistory[date].taken}</Text>
                            <Text style={[styles.takenLabel, { color: theme.colors.textSecondary }]}>Taken</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={[styles.skippedNumber, { color: theme.colors.error }]}>{medicineHistory[date].skipped}</Text>
                            <Text style={[styles.skippedLabel, { color: theme.colors.textSecondary }]}>Skipped</Text>
                        </View>
                    </View>

                    {medicineHistory[date].details && medicineHistory[date].details.length > 0 && (
                        <View style={styles.detailsContainer}>
                            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                            <Text style={[styles.detailsHeader, { color: theme.colors.text }]}>Daily Log</Text>
                            {medicineHistory[date].details.map((item, index) => (
                                <View key={index} style={styles.detailItem}>
                                    <View style={[styles.statusDot, { backgroundColor: item.status === 'taken' ? theme.colors.success : item.status === 'skipped' ? theme.colors.error : theme.colors.textTertiary }]} />
                                    <View style={styles.detailInfo}>
                                        <Text style={[styles.detailName, { color: theme.colors.text }]}>{item.medicineName}</Text>
                                        <Text style={[styles.detailTime, { color: theme.colors.textSecondary }]}>
                                            {new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                    <Text style={[styles.detailStatus, { color: item.status === 'taken' ? theme.colors.success : item.status === 'skipped' ? theme.colors.error : theme.colors.textTertiary }]}>
                                        {item.status === 'taken' ? 'Taken' : item.status === 'skipped' ? 'Skipped' : 'Pending'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    card: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    date: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    stat: {
        alignItems: 'center',
    },
    takenNumber: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    takenLabel: {
        fontSize: 14,
        marginTop: 4,
    },
    skippedNumber: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    skippedLabel: {
        fontSize: 14,
        marginTop: 4,
    },
    emptyBox: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: 16,
    },
    detailsContainer: {
        marginTop: 15,
    },
    divider: {
        height: 1,
        marginBottom: 10,
    },
    detailsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 5,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    detailInfo: {
        flex: 1,
    },
    detailName: {
        fontSize: 15,
        fontWeight: '600',
    },
    detailTime: {
        fontSize: 12,
    },
    detailStatus: {
        fontSize: 13,
        fontWeight: '600',
    },
});

export default HistoryScreen;

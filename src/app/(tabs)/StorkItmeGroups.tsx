import { ThemedCheckbox } from '@/components/themed-checkbox';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { apiGet } from '@/services/api';
import { Link, useRouter } from 'expo-router';

import { useEffect, useState } from 'react';
import { Button, FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';




export default function HomeScreen() {
    const { name,loggedIn,hasIRightRole } = useAuth();
    const theme = useTheme();
    const router = useRouter();

    if(!loggedIn || !hasIRightRole("Manager"))
    {
        router.push("/")
    }
    

  const [storkitmegroups,setstorkitmegroups] = useState([]);
  const [showAllStorkitmegroups, setshowAllStorkitmegroups] = useState(false);

  const columns = [
    { key: "name", title: "Name" },
    { key: "description", title: "Description" },
  ];

    const loadStorkitmegroupsApi = async ( 
      storkitmegroup = showAllStorkitmegroups,
    ) => {

      let url = '/storkitmegroup/GetAll?showAllGroup='+storkitmegroup;

      const storkitmegroupsApi = await apiGet(url);
      setstorkitmegroups(storkitmegroupsApi);
    };

    useEffect(() => {
      let mounted = true;
      loadStorkitmegroupsApi();
      return () => {
        mounted = false;
      };
    }, [showAllStorkitmegroups, loggedIn]);

  const renderRow = ({ item }) => (
    <Pressable onPress={() => router.push(`/storkitmegroup/${item.uuid}`)}>
      <View style={[styles.row]}>
        {columns.map((column) => {
          let val = item[column.key];

          return (
            
              <ThemedText
                type="default"
                key={column.key}
                style={styles.cell}
              >
                {val ?? "-"}
              </ThemedText>
            
          );
        })}
      </View>
    </Pressable>
  );

  
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={[styles.safeArea]}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            {'UserGroups'}
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={[styles.stepContainer]}>
        <View style={[styles.center,{width: "100%", }]}>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator
  >
    <View style={styles.table}>

      <View style={styles.buttonContainer} >
        <View style={[{display: !(loggedIn && hasIRightRole("Member")) ? "none" : "flex", marginBottom: Spacing.three}]}>
          <Link href="/storkitmegroup/create" asChild>
            <Button
              title="Make a new storkitmegroup"
              onPress={() => { console.log('create pressed (link)'); }}
            />
          </Link>
        </View>

        <View style={[{display: !(loggedIn) ? "none" : "flex",marginBottom: Spacing.three}]}>
               <ThemedCheckbox label="Show all Storkitmegroups" value={showAllStorkitmegroups}  onValueChange={setshowAllStorkitmegroups} />
        </View>


      </View>

        <View style={[styles.row, styles.header]}>
            {columns.map((column) => (
            <Text key={column.key} style={styles.headerCell}>
                {column.title}
            </Text>
            ))}
        </View>

        <FlatList
            data={storkitmegroups}
            keyExtractor={(item) => item.uuid}
            renderItem={renderRow}
            style={{ flex: 1 }}
        />


    </View>
  </ScrollView>
</View>
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    paddingTop: Spacing.six,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
     gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
    flex: 1,
  },

   table: {
    minWidth: 500,
    margin: 10,
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  cell: {
    flex: 1,
    padding: 10,
    fontSize: 14,
  },

  header: {
    backgroundColor: "#f2f2f2",
  },

  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: 'flex-start',
    marginBottom: Spacing.four
  },
    center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

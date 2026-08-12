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
    

  const [usergroups,setusergroups] = useState([]);
  const [showAllUsergroups, setshowAllUsergroups] = useState(false);

  const columns = [
    { key: "name", title: "Name" },
  ];

    const loadUsergroupsApi = async ( 
      usergroup = showAllUsergroups,
    ) => {

      let url = '/usergroup/GetAll?showAllGroup='+usergroup;

      const usergroupsApi = await apiGet(url);
      setusergroups(usergroupsApi);
    };

    useEffect(() => {
      let mounted = true;
      loadUsergroupsApi();
      return () => {
        mounted = false;
      };
    }, [showAllUsergroups, loggedIn]);

  const renderRow = ({ item }) => (
    <Pressable onPress={() => router.push(`/usergroup/${item.uuid}`)}>
      <View style={[styles.row, {backgroundColor: item.stork <= 0 ? theme['red'] : ""  }]}>
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
          <Link href="/usergroup/create" asChild>
            <Button
              title="Make a new usergroup"
              onPress={() => { console.log('create pressed (link)'); }}
            />
          </Link>
        </View>

        <View style={[{display: !(loggedIn) ? "none" : "flex",marginBottom: Spacing.three}]}>
               <ThemedCheckbox label="Show all Usergroups" value={showAllUsergroups}  onValueChange={setshowAllUsergroups} />
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
            data={usergroups}
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
    width: 120,
    padding: 10,
    fontSize: 14,
  },

  header: {
    backgroundColor: "#f2f2f2",
  },

  headerCell: {
    width: 120,
    padding: 10,
    fontWeight: "700",
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

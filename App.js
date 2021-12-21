import * as React from 'react';
import { StatusBar, FlatList, Image, Animated, Text, View, Dimensions, StyleSheet, TouchableOpacity, Easing, SafeAreaViewBase, SafeAreaView } from 'react-native';
const { width, height } = Dimensions.get('screen');
import faker from 'faker'
import {useRef} from "react";

faker.seed(10);
const DATA = [...Array(30).keys()].map((_, i) => {
  return {
    key: faker.datatype.uuid(),
    image: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.datatype.number(60)}.jpg`,
    name: faker.name.findName(),
    jobTitle: faker.name.jobTitle(),
    email: faker.internet.email(),
  };
});

const SPACING = 20;
const AVATAR_SIZE = 70;
const BG_IMAGE = "https://images.unsplash.com/photo-1547534887-8d299f2c126b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60"
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3; // avatar + the padding around it (top, and bottom), plus the marginBottom value from each card

export default function App()  {
  const scrollY = useRef(new Animated.Value(0)).current;

  function renderItem(item, index) {
    const inputRange = [
      -1, // state before item hits top edge
      0, // idle state, where we start on render
      ITEM_SIZE * index, // item reaches top edge
      ITEM_SIZE * (index + 2) // end when second item hits top edge
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1,1,1,0]
    })

    const opacityInputRange = [
      -1, // state before item hits top edge
      0, // idle state, where we start on render
      ITEM_SIZE * index, // item reaches top edge
      ITEM_SIZE * (index + .8) // end when second item hits top edge
    ]

    const opacity = scrollY.interpolate({
      inputRange: opacityInputRange,
      outputRange: [1,1,1,0]
    })

    return (
        <Animated.View style={{
          flexDirection: 'row',
          padding: SPACING,
          marginBottom: SPACING,
          borderRadius: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 1,
          shadowRadius: 20,
          opacity,
          transform: [{scale}]
        }}>
          <Image
              source={{uri: item.image}}
              style={{width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE, marginRight: SPACING / 2}}
          />
          <View>
            <Text style={{fontSize: 22, fontWeight: '700' }}>{item.name}</Text>
            <Text style={{fontSize: 16, opacity: 0.7 }}>{item.jobTitle}</Text>
            <Text style={{fontSize: 14, opacity: 0.8, color: "#0099cc" }}>{item.email}</Text>
          </View>
        </Animated.View>
    );
  }

  return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Image
            source={{uri: BG_IMAGE}}
            style={StyleSheet.absoluteFillObject}
            blurRadius={80}
        />
        <StatusBar hidden/>
        <Animated.FlatList
            data={DATA}
            onScroll={
              Animated.event(
                  [{nativeEvent: { contentOffset: { y: scrollY }}}],
                  {useNativeDriver: true}
              )
            }
            keyExtractor={item => item.key}
            renderItem={({item, index}) => renderItem(item, index)}
            contentContainerStyle={{ padding: SPACING, paddingTop: StatusBar.currentHeight}}
            onEndReached={() => console.log('hit end')}
            onEndReachedThreshold={1}
        />
      </View>
  );
}

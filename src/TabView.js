import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const RenderItem = ({
  item,
  index,
  currentIndex,
  preloadNumber,
  total,
  isPreload,
}) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let timeout;
    // get list index item preloadNumber
    if (isPreload) {
      let listIndexPreload = [...new Array(preloadNumber * 2 + 1)].map(
        (value, i) => {
          const preIndex = currentIndex - preloadNumber + i;
          return preIndex;
        },
      );
      // include last item
      if (listIndexPreload.includes(0)) {
        listIndexPreload = [...listIndexPreload, total];
      }
      // include first item
      if (listIndexPreload.includes(total + 1)) {
        listIndexPreload = [...listIndexPreload, 0];
      }
      if (listIndexPreload.includes(index)) {
        timeout = setTimeout(() => setLoading(false), 2000);
      }
    } else {
      setLoading(false);
    }

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);
  return !loading ? (
    <View style={[styles.page, {backgroundColor: item.color}]}>
      <Text style={styles.text}>{item.content}</Text>
    </View>
  ) : (
    <View style={styles.page}>
      <ActivityIndicator size="large" color="dodgerblue" />
    </View>
  );
};

const TabView = ({
  screensData,
  preloadNumber = 0,
  isPreload = false,
  ...rest
}) => {
  // [n, 0, 1, 2, ..., n, 0]
  const data = [
    screensData[screensData.length - 1],
    ...screensData,
    screensData[0],
  ];
  const [index, setIndex] = useState(1);
  const flatListRef = useRef();
  const viewabilityConfig = useRef({
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 95,
  });
  const onViewChanged = useRef(({changed, viewableItems}) => {
    setIndex(changed[0].index);
  });
  useEffect(() => {
    // end reached
    if (index === screensData.length + 1) {
      // go back first screen
      flatListRef.current._listRef._scrollRef.scrollTo({
        x: width,
        animated: false,
      });
      setIndex(1);
    }
    // begin reached
    if (index === 0) {
      // go back first screen
      flatListRef.current._listRef._scrollRef.scrollTo({
        x: width * screensData.length,
        animated: false,
      });
      setIndex(screensData.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  return (
    <FlatList
      ref={flatListRef}
      data={data}
      renderItem={(props) => (
        <RenderItem
          {...props}
          currentIndex={index}
          preloadNumber={preloadNumber}
          isPreload={isPreload}
          total={data.length - 2}
        />
      )}
      viewabilityConfig={viewabilityConfig.current}
      onViewableItemsChanged={onViewChanged.current}
      pagingEnabled={true}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      keyExtractor={(item, i) => i.toString()}
      contentContainerStyle={styles.contentContainer}
      contentOffset={{x: width, y: 0}}
      {...rest}
    />
  );
};

export default TabView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  contentContainer: {
    flexGrow: 1,
  },
  text: {
    color: 'white',
    fontSize: 30,
    alignSelf: 'center',
  },
});

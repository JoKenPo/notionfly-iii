import React, { useContext, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { AddButton } from '../../components/AddButton';
import { NotionContext } from '../../contexts/NotionContext';
import { groupAndSumBy } from './../../utils/array.utils';

export function Dashboards() {
  const notionCore = useContext(NotionContext);

  const [chartData, setChartData] = React.useState([]);


  let pieChartData = [
    {
      name: 'Red',
      population: 45,
      color: 'red',
      legendFontColor: 'black',
      legendFontSize: 15,
    },
    {
      name: 'Blue',
      population: 30,
      color: 'blue',
      legendFontColor: 'black',
      legendFontSize: 15,
    },
    {
      name: 'Green',
      population: 25,
      color: 'green',
      legendFontColor: 'black',
      legendFontSize: 15,
    },
  ];

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99],
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        data: [30, 40, 10, 45, 60],
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        barPercentage: 0.5,
      },
    ],
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  function getPiechart() {
    let categoriesChart = []
    notionCore.transactions[0].map((trans) => {
      // return notionCore.transactions[0].map((trans) => {
      trans.category.map((category) => {
        categoriesChart.push({
          name: category.name,
          population: trans.amount,
          color: category.color,
          legendFontColor: 'black',
          legendFontSize: 12,
        })
      })
    })

    // const groupedData = groupAndSumBy(categoriesChart, "name", "population")

    // const totalPopulation = groupedData.reduce((total, item) => total + item.population, 0);

    // groupedData.forEach((item) => {
    //   item.population = ((item.population / totalPopulation) * 100).toFixed(0);
    // });

    // return groupedData
    return groupAndSumBy(categoriesChart, "name", "population")
  }

  useEffect(() => {
    // console.log('notionCore: ', notionCore);
    // notionCore.notion.getMainDatabase();
    setChartData(getPiechart)
    // eslint-disable-next-line
  }, [notionCore.transactions])

  return (
    <>
      <ScrollView
        className="flex-1"
      >
        <View className="p-4">

          <View className="flex items-center justify-center">

            {/* {
              notionCore.loading ? (<Text>carregando...</Text>)
                : (<Text>ja carregou {JSON.stringify(notionCore.transactions)}</Text>)
            } */}

            {/* Gráfico de Pizza */}
            <PieChart
              data={chartData || pieChartData}
              width={300}
              height={200}
              chartConfig={{
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },

              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />

            {/* Gráfico de Linha */}
            <LineChart
              data={lineChartData}
              width={300}
              height={200}
              yAxisLabel="$"
              chartConfig={{
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              bezier
              className="my-4"
            />

            {/* Gráfico de Barras */}
            <BarChart
              data={barChartData}
              width={300}
              height={200}
              yAxisLabel="$"
              chartConfig={{
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              className="my-4"
            />
          </View>
        </View>
      </ScrollView>
      <AddButton />
    </>
  );
}

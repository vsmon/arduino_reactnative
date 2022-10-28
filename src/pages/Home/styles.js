import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 0 10px;
  background-color: #000;
`;

export const MeasureText = styled.Text`
  font-size: 36px;
  color: ${props => props.color}; //#0066ff;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const StyledActivityIndicator = styled.ActivityIndicator.attrs(
  props => ({size: 'large', color: '#0000ff'}),
)`
  font-size: 36px;
  color: #0066ff;
  //justify-content: flex-start;
  //align-items: flex-start;
  //padding: 20px;
`;

export const ChartContainer = styled.View`
  height: 250px;
  flex-direction: row;
`;

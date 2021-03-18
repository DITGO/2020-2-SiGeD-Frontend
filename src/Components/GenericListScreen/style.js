import styled from 'styled-components';
import colors from '../../Constants/colors';

export const Main = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  background-color: #BFBFBF;
  width: 100vw;
  height: 100vh;
  display: flex;
  justifyContent: center;
  alignItems: center;
`;

export const Container = styled.div`
  width: 90vw;
  display: flex;
  flex-direction: column;
  margin-top: 5%;

  @media(max-width: 750px){
    margin-top: 20px;
    height: 190vw;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media(max-width: 750px){
    margin-top: 0;
    height: 4%;
  }
`;

export const Title = styled.h2`
  font: Open Sans;
  font-weight: 400;
  font-size: 4vh;
  margin: 0;

  @media(max-width: 750px){
    width: 25%;
  }
`;

export const ContentBox = styled.div`
  width: 100%;
  height: 45%;
  box-sizing: border-box;
  border-radius: 0.5rem;
  margin: 1% auto;
  overflow: hidden;

  @media(max-width: 750px){
    width: 100%;
    height: 190vw;
    box-sizing: border-box;
    border-radius: 0.5rem;
    margin-top: 20px;
    margin: 1% auto;
    overflow: auto;
  }
`;

export const Search = styled.div`
  float: left;

  @media(max-width: 750px){
    width: 100%;
    margin-top: -8%;
    left: 100%;
  }
`;

export const TableHeader = styled.div`
  background-color: ${colors.primary};
  color: colors.secondary;
  height: 5vh;
  display: flex;
  flex-direction: row;
  align-items: center;

  @media(max-width: 750px){
    visibility: hidden;
  }
`;

export const P = styled.div`
  color: ${colors.secondary};
  font-size: 2vh;

  @media(max-width: 750px){
    font-size: 1.6vh;
  }
`;

export const Bar = styled.div`
  width: 0.05%;
  height: 35%;
  border-radius: 3px;
  background-color: ${colors.secondary};
`;

export const TableTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: ${(props) => `${props.width}%`}
`;

export const List = styled.div`
  height: 27vw;
  padding: 5px;
  overflow: auto;

  @media(max-width: 750px){
    height: 190vw;
    padding: 5px;
    overflow: auto;
  }
`;

export const style = {
  buttonStyle: {
    margin: '0',
    float: 'right',
    width: '15vw',
    height: '5vh',
    textAlign: 'center',
    bottom: '0',
  },
};

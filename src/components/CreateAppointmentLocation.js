import styled from 'styled-components';
import DateAndTimePicker from './DateAndTimePicker';
import MapSection from './MapSection';

const CreateAppointmentLocation = () => {
  return (
    <MainContainer>
      <HeadingsWrapper>
        <Heading>Choose where and when your appointment is:</Heading>
      </HeadingsWrapper>
      <MapContainer>
        <MapSection />
      </MapContainer>
      <DateAndTimePicker />
    </MainContainer>
  );
};

export default CreateAppointmentLocation;

const MainContainer = styled.div`
  border: 1px solid red;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const HeadingsWrapper = styled.div`
  /* border: 1px solid red; */
  width: 50%;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Heading = styled.h1`
  color: #000;
  font-weight: bold;
  font-size: 3rem;
  margin-bottom: 2rem;
`;

const MapContainer = styled.div`
  border: 1px solid black;
  padding: 2rem 1rem;
  width: 70%;
  margin: 0 auto;
`;
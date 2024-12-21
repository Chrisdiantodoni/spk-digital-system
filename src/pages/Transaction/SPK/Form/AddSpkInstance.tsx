import { useEffect } from 'react';
import Container from '../../../../components/Container';
import createStore from '../../../../context';
import FormGeneralInfoInstance from './SubForm/GeneralTransaction/FormGeneralInfoInstance';

import FormLegalInstance from './SubForm/Customer/FormLegalInstance';

const AddSpkInstance = () => {
  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('SPK INSTANSI');
  }, []);
  return (
    <Container>
      <div className="grid grid-cols-2 gap-y-5 gap-x-10">
        <div className="col-span-1">
          <FormGeneralInfoInstance />
        </div>

        <div className="col-span-1">
          <FormLegalInstance />
        </div>
      </div>
    </Container>
  );
};

export default AddSpkInstance;

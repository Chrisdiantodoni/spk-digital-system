import { useEffect } from 'react';
import Container from '../../../../components/Container';
import createStore from '../../../../context';
import FormGeneralInfoInstance from './SubForm/GeneralTransaction/FormGeneralInfoInstance';
import FormLegalInstance from './SubForm/Customer/FormLegalInstance';
import FormDelivery from './SubForm/Delivery/FormDelivery';
import { FormProvider, useForm } from 'react-hook-form';
import FormDeliveryInstance from './SubForm/Delivery/FormDeliveryInstance';
import Button from '../../../../components/Forms/Button/Button';
import { useNavigate } from 'react-router-dom';
import FormAdditionalFiles from './SubForm/Customer/FormAdditionalFiles';
import FormAdditionalFilesInstance from './SubForm/Customer/FormAdditionalFilesInstance';

const AddInstancePO = () => {
  const { setTitle } = createStore();
  const methods = useForm({
    defaultValues: {
      delivery_option: 'ktp',
    },
  });

  useEffect(() => {
    setTitle('INSTANSI');
  }, []);

  const navigate = useNavigate();

  return (
    <Container>
      <FormProvider {...methods}>
        <div className="grid grid-cols-2 gap-y-5 gap-x-10">
          <div className="col-span-2 lg:col-span-1">
            <FormGeneralInfoInstance />
            <FormAdditionalFilesInstance />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <FormLegalInstance />
            <FormDeliveryInstance />
          </div>
          <div className="col-span-2 lg:flex space-x-5">
            <Button className="btn-confirm lg:w-auto w-full" label="SUBMIT" />
            <Button
              className="btn-delete lg:w-auto w-full"
              label="CANCEL"
              onClick={() => navigate('/transaction/po-instance')}
            />
          </div>
        </div>
      </FormProvider>
    </Container>
  );
};

export default AddInstancePO;

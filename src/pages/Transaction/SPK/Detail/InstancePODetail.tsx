import { useEffect, useState } from 'react';
import Container from '../../../../components/Container';
import createStore from '../../../../context';
import FormGeneralInfoInstance from '../Form/SubForm/GeneralTransaction/FormGeneralInfoInstance';
import DetailGeneralInstance from './DetailSections/GeneralTransaction/DetailGeneralInstance';
import DetailLegalInstance from './DetailSections/Customer/DetailLegalInstance';
import DetailDeliveryInstance from './DetailSections/Delivery/DetailDeliveryInstance';
import DetailAdditionalFilesInstance from './DetailSections/Customer/DetailAdditionalFilesInstance';
import DetailContractInfo from './DetailSections/Customer/DetailContractInstance';
import { FormProvider, useForm } from 'react-hook-form';
import Button from '../../../../components/Forms/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useButtonApproval } from '../../../../hooks/useButtonApproval';
import Table from '../../../../components/Tables/Table';
import { dayjsFormatDateTime } from '../../../../utils/dayjs';
import ModalAddUnit from '../../../../components/Modal/transaction/Spk/Instance/ModalAddUnit';
import { Paperclip, Pencil, Plus, Trash } from 'react-bootstrap-icons';
import ModalAddListUnit from '../../../../components/Modal/transaction/Spk/Instance/ModalAddListUnit';
import ModalAdditionalCost from '../../../../components/Modal/transaction/Spk/Instance/ModalAdditionalCost';

export default function InstancePODetail() {
  const { setTitle } = createStore();
  const [onEditGeneralInstance, setOnEditGeneralInstance] = useState(false);
  const [onEditDelivery, setOnEditDelivery] = useState(false);
  const [onEditLegalInfo, setOnEditLegalInfo] = useState(false);
  const [onEditAdditionalFile, setOneEditAdditionalFile] = useState(false);
  const [onEditShow, setOnEditShow] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const handleModal = createStore((state) => state.handleModal);
  const { backBtn, printBtn } = useButtonApproval();
  const spk_data = {};
  const data = {};
  useEffect(() => {
    setTitle('DETAIL INSTANSI');
  }, []);

  const methods = useForm();

  return (
    <div>
      <ModalAddUnit />
      <ModalAddListUnit />
      <ModalAdditionalCost />
      <Container>
        <FormProvider {...methods}>
          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2 lg:col-span-1">
              <DetailGeneralInstance />
              <DetailContractInfo />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <DetailLegalInstance />
              <DetailDeliveryInstance />
              <DetailAdditionalFilesInstance />
            </div>
          </div>
        </FormProvider>
      </Container>
      <Container className="mt-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2 lg:flex">
            <div className="grid grid-cols-1 lg:flex gap-y-5 gap-x-4 ">
              <Button
                label="EDIT SPK"
                className={'btn-edit w-auto'}
                onClick={methods.handleSubmit()}
              />
              <Button
                label="CANCEL"
                className={'btn-delete w-auto'}
                onClick={() => {}}
              />
            </div>
          </div>
        </div>
      </Container>
      <Container className="mt-5">
        <div className="grid grid-cols-1 lg:flex gap-5 flex-wrap">
          {backBtn({ onClick: () => navigate(-1) })}
          <Button
            label="VOID PO"
            className={'btn-delete w-auto'}
            onClick={() => onChangeStatusSpk('cancel')}
          />
          <Button
            label="CRO CHECK"
            className={'btn-edit w-auto'}
            onClick={() => handleModal('modalCroCheck', true)}
          />
          <Button
            label="DELETE PO"
            className={'btn-delete w-auto'}
            onClick={() => onDeleteSpk()}
          />
          {printBtn({ onClick: () => window.alert('print') })}
          <Button
            label="SHIPMENT"
            className="btn-confirm w-auto"
            onClick={() => handleModal('modalShipmentRegular', true)}
          />
          <Button
            label="FINANCE APPROVE"
            className="btn-confirm w-auto"
            onClick={() => onChangeStatusSpk('finance_check')}
          />
          <Button
            label="DELIVERY"
            className="btn-request w-auto"
            onClick={() => onChangeStatusSpk('finance_check')}
          />
          <Button
            label="PUBLISH SPK"
            className="btn-request w-auto"
            onClick={() => onChangeStatusSpk('finance_check')}
          />
        </div>
        <div className="col-span-2">
          <div className="grid grid-cols-12 gap-5 mt-8">
            <div className="col-span-12 flex items-center gap-x-5">
              <div>
                <p className="detail-title">Unit Info</p>
              </div>
              <div>
                <Button
                  label="ADD UNIT"
                  className="btn-confirm w-auto"
                  onClick={() => handleModal('modalAddUnitInstance', true)}
                />
              </div>
            </div>
            <div className="col-span-12">
              <Table
                className="min-h-25"
                headers={headersUnitInfo}
                data={unitInfo?.map((item: any) => ({
                  ...item,
                  action: [
                    <Button
                      label=""
                      className="btn-confirm w-full lg:w-auto p-2"
                      Icon={<Plus size={20} />}
                      onClick={() => handleModal('modalAddListUnit', true)}
                    />,
                  ],
                }))}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 mb-2">
          <div className="grid grid-cols-12 gap-5 mt-8">
            <div className="col-span-12">
              <p className="detail-title">List Unit</p>
            </div>
            <div className="col-span-12">
              <Table
                className="min-h-25"
                headers={headersUnitList}
                data={listUnitInfo?.map((item: any) => ({
                  ...item,
                  action: [
                    <div className="flex justify-center gap-2">
                      <Button
                        label=""
                        className="btn-edit w-full lg:w-auto p-2"
                        Icon={<Pencil size={18} />}
                        onClick={() => handleModal('modalAddListUnit', true)}
                      />
                      <Button
                        label=""
                        className="btn-confirm w-full lg:w-auto p-2"
                        Icon={<Paperclip size={18} />}
                        onClick={() => handleModal('modalLegalInfo', true)}
                      />
                      <Button
                        label=""
                        className="btn-delete w-full lg:w-auto p-2"
                        Icon={<Trash size={18} />}
                        onClick={() => handleModal('modalAddListUnit', true)}
                      />
                    </div>,
                  ],
                  // neq_log_action: (
                  //   <span>{statusEvent(item.neq_return_log_action)}</span>
                  // ),
                }))}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 lg:flex">
          <div className="grid grid-cols-1 lg:flex gap-y-5 gap-x-4 ">
            <Button
              label="DELIVERY PARTIAL"
              className={'btn-request w-auto'}
              onClick={methods.handleSubmit()}
            />
          </div>
        </div>
        <div className="col-span-2">
          <div className="grid grid-cols-12 gap-5 mt-8">
            <div className="col-span-12 flex gap-x-5 items-center">
              <div>
                <p className="detail-title">List Detail Additional</p>
              </div>
              <div>
                <Button
                  label="ADD ADDITIONAL"
                  onClick={() => handleModal('modalAdditionalCost', true)}
                  className="btn-confirm w-auto lg:w-full"
                />
              </div>
            </div>
            <div className="col-span-12">
              <Table
                className="min-h-25"
                headers={headersAdditional}
                data={data?.data?.spk_log?.map((item: any) => ({
                  ...item,
                  action: [
                    <div className="flex justify-center gap-2">
                      <Button
                        label=""
                        className="btn-edit w-full lg:w-auto p-2"
                        Icon={<Pencil size={18} />}
                        onClick={() => handleModal('modalAdditionalCost', true)}
                      />

                      <Button
                        label=""
                        className="btn-delete w-full lg:w-auto p-2"
                        Icon={<Trash size={18} />}
                        onClick={() => handleModal('modalAddListUnit', true)}
                      />
                    </div>,
                  ],
                  // neq_log_action: (
                  //   <span>{statusEvent(item.neq_return_log_action)}</span>
                  // ),
                }))}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="grid grid-cols-12 gap-5 mt-8">
            <div className="col-span-12">
              <p className="detail-title">Log SPK</p>
            </div>
            <div className="col-span-12">
              <Table
                className="min-h-25"
                headers={headers}
                data={data?.data?.spk_log?.map((item: any) => ({
                  ...item,
                  created_at: (
                    <span>{dayjsFormatDateTime(item.created_at)}</span>
                  ),
                  // neq_log_action: (
                  //   <span>{statusEvent(item.neq_return_log_action)}</span>
                  // ),
                }))}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

const headers = [
  { title: 'TANGGAL', key: 'created_at' },
  { title: 'STAFF', key: 'user.username' },
  { title: 'AKSI', key: 'spk_log_action' },
];
const headersAdditional = [
  { title: 'NO', key: 'no' },
  { title: 'ADDITIONAL', key: 'additional' },
  { title: 'KET. ADDITIONAL', key: 'ket_additional' },
];
const headersUnitList = [
  { title: 'NO', key: 'no' },
  { title: 'Tipe Motor', key: 'motor_type' },
  { title: 'Warna', key: 'color' },
  { title: 'No. Rangka', key: 'color' },
  { title: 'No. Engine', key: 'color' },
  { title: 'AKSI', key: 'action' },
];

const headersUnitInfo = [
  {
    title: 'NO',
    key: 'no',
  },
  {
    title: 'Tipe Motor',
    key: 'motor_type',
  },
  {
    title: 'Warna',
    key: 'warna',
  },
  {
    title: 'Jumlah Unit',
    key: 'quantity',
  },
  {
    title: 'OFF THE ROAD',
    key: 'off_the_road',
  },
  {
    title: 'BBN',
    key: 'bbn',
  },
  {
    title: 'ON THE ROAD',
    key: 'on_the_road',
  },
  {
    title: 'KOMISI',
    key: 'komisi',
  },
  {
    title: 'BOOSTER',
    key: 'booster',
  },
  {
    title: 'OVER DISKON',
    key: 'over_discount',
  },
  {
    title: 'DISC',
    key: 'disc',
  },
  {
    title: 'ADDITIONAL',
    key: 'additional',
  },
  {
    title: 'KET. ADDITIONAL',
    key: 'ket_additional',
  },
  {
    title: 'AKSI',
    key: 'action',
  },
];

const unitInfo = [
  {
    no: 1,
    motor_type: 'Sport',
    warna: 'Red',
    quantity: 10,
    off_the_road: 15000000,
    bbn: 2000000,
    on_the_road: 17000000,
    komisi: 500000,
    booster: 1000000,
    over_discount: 0,
    disc: 0,
    additional: 'Warranty Package',
    ket_additional: 'Extended warranty for 1 year',
  },
];

const listUnitInfo = [
  {
    no: 1,
    motor_type: 'Sport',
    color: 'Red',
    chassis_number: 'ABC123456',
    engine_number: 'DEF789012',
    action: 'View',
  },
  {
    no: 2,
    motor_type: 'Cruiser',
    color: 'Black',
    chassis_number: 'GHI345678',
    engine_number: 'JKL901234',
    action: 'View',
  },
];

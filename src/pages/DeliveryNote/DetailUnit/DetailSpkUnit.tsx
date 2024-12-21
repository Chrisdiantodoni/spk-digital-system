import { Eye } from 'react-bootstrap-icons';
import Button from '../../../components/Forms/Button/Button';
import Table from '../../../components/Tables/Table';
import createStore from '../../../context';
import { dayJsFormatDate } from './../../../utils/dayjs';

export default function DetailSpkUnit({ data }: any) {
  const dataSpk = data;

  const handleModal = createStore((state) => state.handleModal);
  const openPdfInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const handleFiles = () => {
    const Files = dataSpk?.spk_delivery_domicile?.file_sk?.map((item: any) => ({
      ...item,
      name: item?.file,
      type: item?.file?.endsWith('.pdf') ? 'pdf' : 'image',
    }));
    return Files;
  };

  const handleDeliveryType = (type: string) => {
    if (type === 'ktp') {
      return 'Pengantaran KTP';
    } else if (type === 'dealer') {
      return 'Self Pick Up Dealer';
    } else if (type === 'neq') {
      return 'Self Pick Up NEQ';
    } else {
      return 'Pengantaran Alamat Domisili';
    }
  };

  return (
    <div className="grid grid-cols-12 gap-y-6">
      <div className="col-span-12">
        <span className="detail-title">DETAIL SPK </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">No. SPK</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">{dataSpk?.spk_number}</span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Nama Konsumen</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">
          {dataSpk?.spk_customer?.spk_customer_name}
        </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Jenis Pengantaran</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">
          {handleDeliveryType(dataSpk?.spk_delivery_type)}
        </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Tipe Motor</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">
          {dataSpk?.spk_unit?.motor?.motor_name}
        </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Warna</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">
          {dataSpk?.spk_unit?.color?.color_name}
        </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">No. Rangka</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">
          {dataSpk?.spk_unit?.unit?.unit_frame}
        </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">No. Mesin</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">
          {dataSpk?.spk_unit?.unit?.unit_engine}
        </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Tahun Produksi</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">{dataSpk?.spk_unit?.spk_unit_year}</span>
      </div>
      {dataSpk?.spk_delivery_type === 'domicile' && (
        <>
          <div className="col-span-12 flex gap-2 items-center">
            <span className="detail-label">Dokumen</span>
          </div>
          <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
            {handleFiles()?.map((uploadedFile: any, index: number) => (
              <div key={index} className="col-span-4">
                {uploadedFile.type === 'image' && (
                  <div className="relative group">
                    <div
                      className="relative inset-0 opacity-100 hover:opacity-50 transition-opacity cursor-pointer"
                      onClick={() =>
                        handleModal('modalImage', true, uploadedFile?.name)
                      }
                    >
                      <img
                        src={uploadedFile?.name}
                        alt={`Image ${index}`}
                        className="max-h-48 object-contain"
                      />
                    </div>
                  </div>
                )}
                {uploadedFile.type === 'pdf' && (
                  <div className="relative group">
                    <div
                      className="inset-0  opacity-100 hover:opacity-50 transition-opacity cursor-pointer"
                      onClick={() => openPdfInNewTab(uploadedFile?.name)}
                    >
                      <iframe src={uploadedFile?.name} width="100%" />
                    </div>

                    <Button
                      label=""
                      className={
                        'btn-payment px-2 py-2 hidden absolute w-auto top-10 right-0 transition-opacity opacity-0 group-hover:opacity-100'
                      }
                      onClick={() => openPdfInNewTab(uploadedFile?.name)}
                      Icon={<Eye size={18} color="#fff" />}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const header = [
  { title: 'NO.', key: 'no' },
  { title: 'TIPE MOTOR', key: 'neq_unit.unit.motor.motor_name' },
  { title: 'NO. RANGKA', key: 'neq_unit.unit.unit_frame' },
  { title: 'NO. MESIN', key: 'neq_unit.unit.unit_engine' },
  { title: 'WARNA', key: 'neq_unit.unit.color.color_name' },
];

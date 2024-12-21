import ModalImage from '../../../../../../components/Modal/Preview/ModalImage';
import Button from '../../../../../../components/Forms/Button/Button';
import { Eye } from 'react-bootstrap-icons';
import createStore from '../../../../../../context';
import { useEffect, useState } from 'react';

const DetailDeliveryInstance = ({
  customerFiles,
  editDeliveryInfo,
  onEditDeliveryInfo,
  detailDelivery,
}: any) => {
  const [deliveryOption, setDeliveryOption] = useState<string>('');
  const [deliveryData, setDeliveryData] = useState<any>({});

  const { handleModal } = createStore();

  const handleDeliveryOption = () => {
    switch (deliveryOption) {
      case 'ktp':
        return 'Pengantaran KTP';
      case 'dealer':
        return 'Self Pick-Up Dealer';
      case 'neq':
        return 'Self Pick-Up Neq';
      case 'domicile':
        return 'Pengantaran Alamat Domisili';
      default:
        break;
    }
  };

  const openPdfInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (detailDelivery?.spk_delivery_type === 'ktp') {
      setDeliveryOption('ktp');
      setDeliveryData(detailDelivery?.spk_delivery_ktp);
    } else if (detailDelivery?.spk_delivery_type === 'neq') {
      setDeliveryOption('neq');
      setDeliveryData(detailDelivery?.spk_delivery_dealer_neq);
    } else if (detailDelivery?.spk_delivery_type === 'dealer') {
      setDeliveryOption('dealer');
      setDeliveryData(detailDelivery?.spk_delivery_dealer);
    } else if (detailDelivery?.spk_delivery_type === 'domicile') {
      setDeliveryOption('domicile');
      setDeliveryData(detailDelivery?.spk_delivery_domicile);
    }
  }, [detailDelivery]);

  const renderDeliveryOption = () => {
    switch (detailDelivery?.spk_delivery_type) {
      case 'ktp':
        return (
          <>
            <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
              <p className="detail-label">Nama</p>
            </div>
            <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {deliveryData?.spk_delivery_ktp_customer_name || '-'}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
              <p className="detail-label">Alamat</p>
            </div>
            <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {' '}
                {deliveryData?.spk_delivery_ktp_customer_address || '-'}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
              <p className="detail-label">Kota</p>
            </div>
            <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {deliveryData?.spk_delivery_ktp_city || '-'}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
              <p className="detail-label">No. Telp</p>
            </div>
            <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {deliveryData?.spk_delivery_ktp_no_telp || '-'}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
              <p className="detail-label">No. Ponsel</p>
            </div>
            <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {deliveryData?.spk_delivery_ktp_no_phone || '-'}
              </p>
            </div>
          </>
        );
      case 'dealer':
        return (
          <>
            <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
              <p className="detail-label">Nama</p>
            </div>
            <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {deliveryData?.spk_delivery_dealer_customer_name || '-'}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
              <p className="detail-label">No. Ponsel</p>
            </div>
            <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {deliveryData?.spk_delivery_dealer_no_phone || '-'}
              </p>
            </div>
          </>
        );
      case 'neq':
        return (
          <>
            <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
              <p className="detail-label">NEQ</p>
            </div>
            <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {deliveryData?.dealer_neq_id?.dealer_neq_name || '-'}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
              <p className="detail-label">Nama</p>
            </div>
            <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {deliveryData?.dealer_delivery_neq_customer_name || '-'}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
              <p className="detail-label">No. Ponsel</p>
            </div>
            <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {deliveryData?.dealer_delivery_neq_customer_no_phone || '-'}
              </p>
            </div>
          </>
        );
      case 'domicile':
        return (
          <>
            <div className="col-span-12 lg:col-span-4 flex items-center">
              <p className="detail-label">Nama</p>
            </div>
            <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {deliveryData?.spk_delivery_domicile_customer_name || '-'}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 flex items-center">
              <p className="detail-label">Alamat</p>
            </div>
            <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {deliveryData?.spk_delivery_domicile_address || '-'}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 flex items-center">
              <p className="detail-label">Kota</p>
            </div>
            <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {deliveryData?.spk_delivery_domicile_city || '-'}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 flex items-center">
              <p className="detail-label">Dokumen</p>
            </div>
            <div className="col-span-12 lg:col-span-12 flex mt-[-18px] items-center w-full"></div>
            {customerFiles?.deliveryFiles?.map(
              (uploadedFile: any, index: number) => (
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
              ),
            )}
          </>
        );
      default:
        break;
    }
  };

  const handleToggleEditDeliveryInfo = () => {
    onEditDeliveryInfo(!editDeliveryInfo);
  };

  return (
    <div className="grid grid-cols-2 gap-6 mt-8">
      <ModalImage />
      <div className="col-span-12 lg:col-span-6">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 flex justify-between items-center">
            <div className="detail-title">Delivery Info</div>
            {detailDelivery?.spk_status !== 'spk' && (
              <div>
                <Button
                  label="EDIT"
                  className={'btn-edit-outline w-auto px-5 py-2'}
                  onClick={() => handleToggleEditDeliveryInfo()}
                />
              </div>
            )}
          </div>
          <div className="col-span-12 mt-2">
            <hr />
          </div>
          {/* <div className="col-span-12 lg:col-span-4 flex items-center">
            <p className="detail-label">No. Surat Jalan</p>
          </div>
          <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">-</p>
          </div> */}
          <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
            <p className="detail-label">Opsi Pengantaran</p>
          </div>
          <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">{handleDeliveryOption()}</p>
          </div>
          <div className="col-span-12">
            <hr />
          </div>
          {renderDeliveryOption()}
        </div>
      </div>
    </div>
  );
};

export default DetailDeliveryInstance;

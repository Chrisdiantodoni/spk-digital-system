import { useFormContext } from 'react-hook-form';
import Button from '../../../../../../components/Forms/Button/Button';

const DetailUnit = ({ detailUnit, onEditUnitInfo, editUnitInfo }: any) => {
  const { register } = useFormContext();

  const handleChangeIsEdit = () => {
    onEditUnitInfo(!editUnitInfo);
  };
  const data = detailUnit?.spk_unit;

  return (
    <div className="grid grid-cols-12 gap-x-6 mb-10 ">
      <div className="col-span-12 flex justify-between items-center  mt-10">
        <div className="detail-title">Unit Info</div>
        {detailUnit?.spk_status !== 'spk' && (
          <div>
            <Button
              label="EDIT"
              className={'btn-edit-outline w-auto px-5 py-2'}
              onClick={() => handleChangeIsEdit()}
            />
          </div>
        )}
      </div>
      <div className="col-span-12 mt-2 ">
        <hr />
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 lg:my-3 flex items-center">
        <p className="detail-label">Tipe Motor</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.motor?.motor_name}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 lg:my-3 flex items-center">
        <p className="detail-label">Warna</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.color?.color_name}</p>
      </div>
    </div>
  );
};

export default DetailUnit;

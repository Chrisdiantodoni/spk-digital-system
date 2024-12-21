import Button from '../../../../../../components/Forms/Button/Button';
import { formatRupiah } from '../../../../../../utils/formatter';

const DetailPricingInfo = ({
  detailPricing,
  editPricingInfo,
  onEditPricingInfo,
  additionalPriceInput,
  accessoriesPriceInput,
}: any) => {
  const handleToggleEditPricingInfo = () => {
    onEditPricingInfo(!editPricingInfo);
  };

  const data = detailPricing?.spk_pricing;

  return (
    <div className="grid grid-cols-12 gap-x-10 mt-8">
      <div className="col-span-12 flex justify-between items-center">
        <div className="detail-title">Pricing Info</div>
        {detailPricing?.spk_status !== 'spk' && (
          <div>
            <Button
              label="EDIT"
              className={'btn-edit-outline w-auto px-5 py-2'}
              onClick={() => handleToggleEditPricingInfo()}
            />
          </div>
        )}
      </div>
      <div className="col-span-12 mt-2 mb-3">
        <hr />
      </div>
      <div className="col-span-12 ">
        <div className="grid grid-cols-12 gap-4 ">
          <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">Off the Road</p>
          </div>
          <div className="col-span-12 lg:col-span-10 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_off_the_road)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">BBN</p>
          </div>
          <div className="col-span-12 lg:col-span-10 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_bbn)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">On the Road</p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_on_the_road)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 flex items-center gap-2">
            <p className="detail-label">
              {data?.spk_pricing_on_the_road_note || '-'}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">Indent</p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_indent_nominal)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 flex items-center gap-2">
            <p className="detail-label">
              {data?.spk_pricing_indent_note || '-'}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">Discount </p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_discount)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 flex items-center gap-2">
            <p className="detail-label">
              {data?.spk_pricing_discount_note || '-'}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">Over Discount </p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_over_discount)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 flex items-center gap-2">
            <p className="detail-label">
              {data?.spk_pricing_over_discount_note || '-'}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">Subsidi </p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_subsidi)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 flex items-center gap-2">
            <p className="detail-label">
              {data?.spk_pricing_subsidi_note || '-'}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">Booster</p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_booster)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 flex items-center gap-2">
            <p className="detail-label">
              {data?.spk_pricing_booster_note || '-'}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">Komisi </p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_commission)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 flex items-center gap-2">
            <p className="detail-label">
              {data?.spk_pricing_commission_note || '-'}
            </p>
          </div>
          {/* <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">Komisi Surveyor</p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_commission_surveyor)}
            </p>
          </div> */}
          {/* <div className="col-span-12 lg:col-span-7 flex items-center gap-2">
            <p className="detail-label">
              {data?.spk_pricing_surveyor_commission_note || '-'}
            </p>
          </div> */}
          <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">Nama Broker </p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">{data?.spk_pricing_broker_name}</p>
          </div>
          <div className="col-span-12 lg:col-span-7 flex items-center gap-2">
            <p className="detail-label">
              {data?.spk_pricing_broker_note || '-'}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">Komisi Broker </p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_broker_commission)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 flex items-center gap-2">
            <p className="detail-label">
              {data?.spk_pricing_broker_commission_note || '-'}
            </p>
          </div>
          {/* <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">Cashback </p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_cashback)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 flex items-center gap-2">
            <p className="detail-label">
              {data?.spk_pricing_cashback_note || '-'}
            </p>
          </div> */}
          <div className="col-span-12 lg:col-span-2 flex items-center">
            <p className="detail-label">Biaya Pengantaran</p>
          </div>
          <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_pricing_delivery_cost)}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 flex items-center gap-2">
            <p className="detail-label">
              {data?.spk_pricing_delivery_cost_note || '-'}
            </p>
          </div>

          {accessoriesPriceInput?.map((item: any, index: number) => (
            <>
              <div
                key={index}
                className="col-span-12 lg:col-span-2 flex items-center"
              >
                <p className="detail-label">Accessories {index + 1}</p>
              </div>
              <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
                <p className="hidden lg:block">:</p>

                <p className="detail-label">
                  {formatRupiah(item?.spk_pricing_accecories_price)}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-7 items-center gap-2">
                <p className="detail-label">
                  {item?.spk_pricing_accecories_note || '-'}
                </p>
              </div>
            </>
          ))}

          {/* {additionalPriceInput?.map((item: any, index: number) => (
            <>
              <div
                className="col-span-12 lg:col-span-2 flex items-center"
                key={index}
              >
                <p className="detail-label">Additional {index + 1}</p>
              </div>
              <div className="col-span-12 lg:col-span-3 flex items-center gap-2">
                <p className="hidden lg:block">:</p>
                <p className="detail-label">
                  {formatRupiah(item?.spk_pricing_additional_price)}
                </p>
              </div>
              <div className="col-span-12 lg:col-span-7 items-center gap-2">
                <p className="detail-label">
                  {item?.spk_pricing_additional_note || '-'}
                </p>
              </div>
            </>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default DetailPricingInfo;

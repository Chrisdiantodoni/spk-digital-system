import { Controller, useFormContext, useWatch } from 'react-hook-form';
import Button from '../../../../../../components/Forms/Button/Button';
import { Dash, Plus } from 'react-bootstrap-icons';
import SelectBroker from '../../../../../../components/Forms/SelectGroup/Master/SelectBroker';
import { ControllerInput } from '../../../../../../utils/ControllerInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import spk from '../../../../../../Services/API/transaction/spk';

const FormPricingInfo = ({
  onAddAccessoriesInput,
  accessoriesPriceInput,
}: any) => {
  const {
    register,
    control,
    resetField,
    formState: { errors },
  } = useFormContext();

  const handleAddAccessoriesPrice = () => {
    const newInput = { label: `Aksesoris ${accessoriesPriceInput.length + 1}` };
    onAddAccessoriesInput([...accessoriesPriceInput, newInput]);
  };

  // const handleAddAdditionalPrice = () => {
  //   const newInput = { label: `Additional ${additionalPriceInput.length + 1}` };
  //   onAddAditionalPriceInput([...additionalPriceInput, newInput]);
  // };
  const queryClient = useQueryClient();

  const handleRemoveAccessoriesPrice = () => {
    const updatedInputs = [...accessoriesPriceInput];
    const lastAccessoriesPrice = updatedInputs[updatedInputs.length - 1];
    const lastIndex = accessoriesPriceInput.length - 1;
    if (lastAccessoriesPrice?.id) {
      removePriceAccessories(lastAccessoriesPrice?.id);
      resetField(`spk_pricing_accessories.${lastIndex}.accessories_price`);
      updatedInputs.pop();
    } else {
      updatedInputs.pop();
    }
    onAddAccessoriesInput(updatedInputs);
  };

  const { mutate: removePriceAccessories } = useMutation({
    mutationFn: async (id: any) => {
      const response = await spk.deleteAccessoriesPrice(id);
      return response;
    },
    onSuccess: (res: any) => {
      if (res.meta.code === 200) {
        queryClient.invalidateQueries({ queryKey: ['detail_spk_regular'] });
        console.log('jalan');
      }
    },
  });

  const buying_method = useWatch({
    control,
    name: 'spk_transaction_method_buying',
  });

  return (
    <div className="grid grid-cols-12 gap-x-10 mt-8">
      <div className="col-span-12">
        <div className="detail-title">Pricing Info</div>
      </div>
      <div className="col-span-12 mt-4">
        <hr />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Off the Road (Rp.)</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_off_the_road"
          control={control}
          rules={{
            required: 'Off the road wajib diisi.',
          }}
          defaultValue={''}
          type={'currency'}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_pricing_off_the_road && (
          <span className="text-error">
            {errors.spk_pricing_off_the_road.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6   flex items-center">
        <p className="detail-label">BBN (Rp.)</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_bbn"
          control={control}
          rules={{
            required: 'BBN wajib diisi',
          }}
          disabled={buying_method === 'off_the_road' ? true : false}
          defaultValue={'0'}
          type="currency"
        />
      </div>
      <div className="col-span-4 lg:block hidden" />

      <div className="col-span-12 lg:col-span-8">
        {errors.spk_pricing_bbn && (
          <span className="text-error">
            {errors.spk_pricing_bbn.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">On the Road (Rp.)</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_on_the_road"
          control={control}
          rules={{
            required: 'On the road wajib diisi',
          }}
          defaultValue={'0'}
          disabled={true}
          type="currency"
        />
        <input
          className="text-input"
          {...register('spk_pricing_on_the_road_note')}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Indent (Rp.)</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_indent"
          control={control}
          disabled
          defaultValue={'0'}
          type="currency"
        />
        <input
          className="text-input"
          {...register('spk_pricing_indent_note')}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Discount (Rp.)</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_discount"
          control={control}
          defaultValue={'0'}
          type="currency"
        />
        <input
          className="text-input"
          {...register('spk_pricing_discount_note')}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Over Discount (Rp.)</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_over_discount"
          control={control}
          defaultValue={'0'}
          type="currency"
        />
        <input
          className="text-input"
          {...register('spk_pricing_over_discount_note')}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Subsidi (Rp.)</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_subsidi"
          control={control}
          defaultValue={'0'}
          type="currency"
        />

        <input
          className="text-input"
          {...register('spk_pricing_subsidi_note')}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Booster (Rp.)</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_booster"
          control={control}
          defaultValue={'0'}
          type="currency"
        />
        <input
          className="text-input"
          {...register('spk_pricing_booster_note')}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Komisi (Rp.)</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_commission"
          control={control}
          defaultValue={'0'}
          type="currency"
        />
        <input
          className="text-input"
          {...register('spk_pricing_commission_note')}
        />
      </div>
      {/* <div className="col-span-12 lg:col-span-4 flex items-center">
        <p className="detail-label">Komisi Surveyor (Rp.)</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_surveyor_commission"
          control={control}
          rules={{
            required: 'wajib diisi.',
          }}
          defaultValue={'0'}
          type="currency"
        />

        <input
          className="text-input"
          {...register('spk_pricing_surveyor_commission_note')}
        />
      </div> */}
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Nama Broker</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_pricing_broker_name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectBroker onChange={onChange} value={value} />
          )}
        />

        <div className="w-full">
          <input
            className="text-input"
            {...register('spk_pricing_broker_note')}
          />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Komisi Broker (Rp.)</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_broker_commission"
          control={control}
          defaultValue={'0'}
          type="currency"
        />
        <input
          className="text-input"
          {...register('spk_pricing_broker_commission_note')}
        />
      </div>
      {/* <div className="col-span-12 lg:col-span-4 flex items-center">
        <p className="detail-label">Cashback (Rp.)</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_cashback"
          control={control}
          rules={{
            required: 'komisi wajib diisi.',
          }}
          defaultValue={'0'}
          type="currency"
        />

        <input
          className="text-input"
          {...register('spk_pricing_cashback_note')}
        />
      </div> */}
      <div className="col-span-12 lg:col-span-4 flex my-4 lg:my-6    items-center">
        <p className="detail-label">Biaya Pengantaran (Rp.)</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_pricing_delivery"
          control={control}
          defaultValue={''}
          type="currency"
        />

        <input
          className="text-input"
          {...register('spk_pricing_delivery_cost_note')}
        />
      </div>
      <div className="col-span-12 lg:col-span-12 flex gap-x-2 items-center justify-end">
        {accessoriesPriceInput?.length > 1 && (
          <Button
            label=""
            Icon={<Dash size={20} />}
            className={'btn-delete w-auto p-2'}
            onClick={() => handleRemoveAccessoriesPrice()}
          />
        )}
        <Button
          label=""
          Icon={<Plus size={20} />}
          className={'btn-confirm w-auto p-2'}
          onClick={() => handleAddAccessoriesPrice()}
        />
      </div>

      {accessoriesPriceInput.map((input: any, index: number) => (
        <div key={`${input?.label}-${index}`} className="col-span-12">
          <div className="grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
              <p className="detail-label">{input?.label} (Rp.)</p>
            </div>
            <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <ControllerInput
                name={`spk_pricing_accessories.${index}.accessories_price`}
                control={control}
                defaultValue={'0'}
                type="currency"
              />

              <input
                className="text-input"
                {...register(
                  `spk_pricing_accessories.${index}.accessories_note`,
                )}
              />
            </div>
          </div>
        </div>
      ))}

      {/* <div className="col-span-12 lg:col-span-12 flex items-center gap-x-2 justify-end">
        {additionalPriceInput?.length > 1 && (
          <Button
            label=""
            Icon={<Dash size={20} />}
            className={'btn-delete w-auto p-2'}
            onClick={() => handleRemoveAdditionalPrice()}
          />
        )}
        <Button
          label=""
          Icon={<Plus size={20} />}
          className={'btn-confirm w-auto p-2'}
          onClick={() => handleAddAdditionalPrice()}
        />
      </div>
      {additionalPriceInput.map((input: any, index: number) => (
        <div key={`${input?.label}-${index}`} className="col-span-12">
          <div className="grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="col-span-12 lg:col-span-4 flex items-center">
              <p className="detail-label">{input?.label} (Rp.)</p>
            </div>
            <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <ControllerInput
                name={`spk_pricing_additional.${index}.additional_price`}
                control={control}
                rules={{
                  required: 'komisi wajib diisi.',
                }}
                defaultValue={''}
                type="currency"
              />

              <input
                className="text-input"
                {...register(`spk_pricing_additional.${index}.additional_note`)}
              />
            </div>
          </div>
        </div>
      ))} */}
    </div>
  );
};

export default FormPricingInfo;

interface Location {
  type: string;
  value?: {
    dealer_neq_id?: string;
  };
}

interface Motor {
  motor_pricelist?: Array<{
    pricelist_location_type?: string;
    dealer_neq_id?: string;
    off_the_road?: number;
    bbn?: number;
    discount: number;
  }>;
  value?: {
    motor_pricelist?: Array<{
      pricelist_location_type?: string;
      dealer_neq_id?: string;
      off_the_road?: number;
      bbn?: number;
      discount: number;
    }>;
  };
}

function usePricingUpdate(
  buy_method: string,
  location: Location,
  motor: Motor,
) {
  const findPriceList = (location_type?: any) => {
    let price_list;
    if (motor?.value) {
      if (location_type === 'dealer') {
        price_list = motor?.value?.motor_pricelist?.find(
          (find: any) => find?.pricelist_location_type === location_type,
        );
      } else {
        price_list = motor?.value?.motor_pricelist?.find(
          (find: any) => find?.dealer_neq_id === location?.value?.dealer_neq_id,
        );
      }
    } else {
      if (location_type === 'dealer') {
        price_list = motor?.motor_pricelist?.find(
          (find: any) => find?.pricelist_location_type === location_type,
        );
      } else {
        price_list = motor?.motor_pricelist?.find(
          (find: any) => find?.dealer_neq_id === location?.value?.dealer_neq_id,
        );
      }
    }
    return price_list;
  };

  const off_the_road =
    findPriceList(location?.type)?.off_the_road === 0
      ? 0
      : findPriceList(location?.type)?.off_the_road;
  const bbn = findPriceList(location?.type)?.bbn;
  const discount = findPriceList(location?.type)?.discount;
  return { off_the_road, findPriceList, bbn, discount };
}

export default usePricingUpdate;

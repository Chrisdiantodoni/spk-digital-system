import { useQuery } from '@tanstack/react-query';
import Container from '../../../components/Container';
import priceList from '../../../Services/API/priceList';
import { useParams } from 'react-router-dom';
import Loader2 from '../../../common/Loader/Loader';
import createStore from '../../../context';
import { useEffect } from 'react';
import Table from '../../../components/Tables/Table';
import { formatRupiah } from '../../../utils/formatter';
import { dayjsFormatDateTime } from '../../../utils/dayjs';

const PriceListDetail = () => {
  const { id } = useParams();

  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('DETAIL PRICE LIST');
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['getPriceListById'],
    queryFn: async () => {
      const response = await priceList.getPriceListDetail(id);
      return response;
    },
  });

  const dataPriceList = data?.data;

  return isLoading ? (
    <Container>
      <div className="grid grid-cols-12">
        <div className="col-span-12 h-100 items-center justify-center flex">
          <Loader2 />
        </div>
      </div>
    </Container>
  ) : (
    <Container>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 detail-title">Detail Price List</div>
        <div className="col-span-12">
          <hr />
        </div>
        <div className="col-span-12 lg:col-span-3 ">
          <p className="detail-label">Tipe</p>
        </div>
        <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
          <p className="hidden lg:block">:</p>
          <span className="detail-label">
            {dataPriceList?.motor?.motor_name}
          </span>
        </div>
        <div className="col-span-12 lg:col-span-3 ">
          <p className="detail-label">Cabang</p>
        </div>
        <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
          <p className="hidden lg:block">:</p>
          <span className="detail-label">
            {dataPriceList?.dealer
              ? dataPriceList?.dealer?.dealer_name
              : dataPriceList?.dealer_neq?.dealer_neq_name}
          </span>
        </div>

        <div className="col-span-12">
          <div className="detail-title">History Price List</div>
        </div>
        <div className="col-span-12">
          <Table
            headers={headers}
            data={dataPriceList?.pricelist_motor_histories?.map(
              (item: any, index: number) => ({
                ...item,
                no: <span>{index + 1}</span>,
                off_the_road: <span>{formatRupiah(item?.off_the_road)}</span>,
                bbn: <span>{formatRupiah(item?.bbn)}</span>,
                discount: <span>{formatRupiah(item?.discount)}</span>,
                on_the_road: (
                  <span>{formatRupiah(item?.off_the_road + item?.bbn)}</span>
                ),
                updated_at: (
                  <span>{dayjsFormatDateTime(item?.updated_at)}</span>
                ),
              }),
            )}
          />
        </div>
      </div>
    </Container>
  );
};

const headers = [
  {
    title: 'NO',
    key: 'no',
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
    title: 'DISCOUNT',
    key: 'discount',
  },
  {
    title: 'STAFF',
    key: 'user.username',
  },
  {
    title: 'TANGGAL UPDATE',
    key: 'updated_at',
  },
];

export default PriceListDetail;

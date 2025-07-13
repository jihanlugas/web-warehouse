import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { StockmovementvehicleView } from "@/types/stockmovementvehicle";
import { displayDateTime, displayNumber, displayPhoneNumber } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditStockmovementvehicle from "@/components/modal/modal-edit-stockmovementvehicle";
import MainOperator from "@/components/layout/main-operator";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [stockmovementvehicle, setStockmovementvehicle] = useState<StockmovementvehicleView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditStockmovementvehicle, setShowModalEditStockmovementvehicle] = useState<boolean>(false);

  const preloads = 'Stockmovement,Stockmovement.Retail,Stockmovement.Retail.Customer,Vehicle'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['stockmovementvehicle', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/stockmovementvehicle/' + id, { preloads }) : null
    },
  })

  const toggleModalEditStockmovementvehicle = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditStockmovementvehicle(!showModalEditStockmovementvehicle);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setStockmovementvehicle(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Retail Detail'}</title>
      </Head>
      <ModalEditStockmovementvehicle
        show={showModalEditStockmovementvehicle}
        onClickOverlay={toggleModalEditStockmovementvehicle}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Retail', path: '/retail' },
            { name: stockmovementvehicle?.number || id, path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading && stockmovementvehicle ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="text-xl flex justify-between items-center mb-2">
                  <div>Retail</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Stockmovementvehicle'
                    onClick={() => toggleModalEditStockmovementvehicle(stockmovementvehicle?.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="mb-4">
                  <div className="text-lg mb-4">{stockmovementvehicle?.stockmovement?.retail?.number || '-'}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                    <div className="text-gray-600">{'Customer'}</div>
                    <div className="col-span-1 sm:col-span-4">{stockmovementvehicle?.stockmovement?.retail?.customer?.name || '-'}</div>
                    <div className="text-gray-600">{'Address'}</div>
                    <div className="col-span-1 sm:col-span-4 whitespace-pre-wrap">{stockmovementvehicle?.stockmovement?.retail?.customer?.address || '-'}</div>
                    <div className="text-gray-600">{'Phone Number'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayPhoneNumber(stockmovementvehicle?.stockmovement?.retail?.customer?.phoneNumber) || '-'}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-lg mb-4">Vehicle</div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                    <div className="text-gray-600">{'Vehicle Name'}</div>
                    <div className="col-span-1 sm:col-span-4">{stockmovementvehicle?.vehicle?.name || '-'}</div>
                    <div className="text-gray-600">{'Plate Number'}</div>
                    <div className="col-span-1 sm:col-span-4">{stockmovementvehicle?.vehicle?.plateNumber || '-'}</div>
                    <div className="text-gray-600">{'Driver Name'}</div>
                    <div className="col-span-1 sm:col-span-4">{stockmovementvehicle?.vehicle?.driverName || '-'}</div>
                    <div className="text-gray-600">{'Phone Number'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayPhoneNumber(stockmovementvehicle?.vehicle?.phoneNumber) || '-'}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-lg mb-4">Detail</div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                    <div className="text-gray-600">{'Sent Gross Quantity'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayNumber(stockmovementvehicle?.sentGrossQuantity)}</div>
                    <div className="text-gray-600">{'Sent Tare Quantity'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayNumber(stockmovementvehicle?.sentTareQuantity)}</div>
                    <div className="text-gray-600">{'Sent Net Quantity'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayNumber(stockmovementvehicle?.sentNetQuantity)}</div>
                    <div className="text-gray-600">{'Sent Time'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayDateTime(stockmovementvehicle?.sentTime) || '-'}</div>
                    <div className="text-gray-600">{'Create By'}</div>
                    <div className="col-span-1 sm:col-span-4">{stockmovementvehicle?.createName}</div>
                    <div className="text-gray-600">{'Create Date'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayDateTime(stockmovementvehicle?.createDt)}</div>
                    <div className="text-gray-600">{'Last Update By'}</div>
                    <div className="col-span-1 sm:col-span-4">{stockmovementvehicle?.updateName}</div>
                    <div className="text-gray-600">{'Last Update Date'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayDateTime(stockmovementvehicle?.updateDt)}</div>
                  </div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(stockmovementvehicle, null, 4)}
              </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainOperator;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    }
  };
};


export default Index;
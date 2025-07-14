import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { InboundView } from "@/types/inbound";
import { displayDateTime, displayNumber, displayPhoneNumber } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MainOperator from "@/components/layout/main-operator";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [inbound, setInbound] = useState<InboundView>(null)


  const preloads = 'Stockmovement,Stockmovement.ToWarehouse,Vehicle'
  const { data, isLoading } = useQuery({
    queryKey: ['inbound', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/inbound/' + id, { preloads }) : null
    },
  })

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setInbound(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Transfer In Detail'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Transfer In', path: '/inbound' },
            { name: inbound?.number || id, path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="text-xl flex justify-between items-center mb-2">
                  <div>Transfer In</div>
                </div>
                <div className="mb-4">
                  <div className="text-lg mb-4">Vehicle</div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                    <div className="text-gray-600">{'Vehicle Name'}</div>
                    <div className="col-span-1 sm:col-span-4">{inbound?.vehicle?.name || '-'}</div>
                    <div className="text-gray-600">{'Plate Number'}</div>
                    <div className="col-span-1 sm:col-span-4">{inbound?.vehicle?.plateNumber || '-'}</div>
                    <div className="text-gray-600">{'Driver Name'}</div>
                    <div className="col-span-1 sm:col-span-4">{inbound?.vehicle?.driverName || '-'}</div>
                    <div className="text-gray-600">{'Phone Number'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayPhoneNumber(inbound?.vehicle?.phoneNumber) || '-'}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-lg mb-4">Detail</div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                    <div className="text-gray-600">{'Destination'}</div>
                    <div className="col-span-1 sm:col-span-4">{inbound?.stockmovement?.toWarehouse?.name || '-'}</div>
                    <div className="text-gray-600">{'Remark'}</div>
                    <div className="col-span-1 sm:col-span-4 whitespace-pre-wrap">{inbound?.remark || '-'}</div>
                    <div className="text-gray-600">{'Sent Gross Quantity'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayNumber(inbound?.sentGrossQuantity)}</div>
                    <div className="text-gray-600">{'Sent Tare Quantity'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayNumber(inbound?.sentTareQuantity)}</div>
                    <div className="text-gray-600">{'Sent Net Quantity'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayNumber(inbound?.sentNetQuantity)}</div>
                    <div className="text-gray-600">{'Sent Time'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayDateTime(inbound?.sentTime) || '-'}</div>
                    <div className="text-gray-600">{'Recived Gross Quantity'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayNumber(inbound?.recivedGrossQuantity)}</div>
                    <div className="text-gray-600">{'Recived Tare Quantity'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayNumber(inbound?.recivedTareQuantity)}</div>
                    <div className="text-gray-600">{'Recived Net Quantity'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayNumber(inbound?.recivedNetQuantity)}</div>
                    <div className="text-gray-600">{'Recived Time'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayDateTime(inbound?.recivedTime) || '-'}</div>
                    <div className="text-gray-600">{'Create By'}</div>
                    <div className="col-span-1 sm:col-span-4">{inbound?.createName}</div>
                    <div className="text-gray-600">{'Create Date'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayDateTime(inbound?.createDt)}</div>
                    <div className="text-gray-600">{'Last Update By'}</div>
                    <div className="col-span-1 sm:col-span-4">{inbound?.updateName}</div>
                    <div className="text-gray-600">{'Last Update Date'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayDateTime(inbound?.updateDt)}</div>
                  </div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(inbound, null, 4)}
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
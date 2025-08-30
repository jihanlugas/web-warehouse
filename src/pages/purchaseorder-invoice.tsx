import PageWithLayoutType from '@/types/layout';
import MainAuth from '@/components/layout/main-auth';
import Dashboard from '@/pages/dashboard';
import AdminDashboard from '@/pages/admin/dashboard';
import { LoginUser } from '@/types/auth';
import { NextPage } from 'next/types';
import { USER_ROLE_ADMIN } from '@/utils/constant';


type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = ({ loginUser }) => {
  return (
    <div className="page p-8 shadow">
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="col-span-2 flex">
          <div className="flex-none w-24 h-24 bg-red-200 rounded-full mr-4">
          </div>
          <div className="flex-1">
            <div className="text-xl font-bold">PT. MAJU JAYA ABADI</div>
            <div className="">Jl. Tambang Raya No. 88, Kalimantan Selatan</div>
            <div className="">Telp. (0511) 12345678</div>
            <div className="">Email: info@majujaya.co.id</div>
          </div>
        </div>
        <div className="w-full text-center">
          <div className="border-2 p-2 mb-4">PO/ASD/123/DELIVERY/1222</div>
          <div className="text-3xl font-bold uppercase">INVOICE</div>
        </div>
      </div>
      <hr className="border my-4" />
      <div className="mb-8">
        <div className="text-xl font-bold">Tujuan</div>
        <div>.Customer.Name</div>
        <div className="">displayPhoneNumber .Customer.PhoneNumber</div>
      </div>
      <div className='mb-8'>
        <div className='mb-4'>Rincian Pengiriman:</div>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left">
              <th className='px-2 border-2 border-gray-400 py-4'>Tanggal Dikirim</th>
              <th className='px-2 border-2 border-gray-400 py-4'>Produk</th>
              <th className='px-2 border-2 border-gray-400 py-4'>Harga Per Ton</th>
              <th className='px-2 border-2 border-gray-400 py-4'>Net</th>
              <th className='px-2 border-2 border-gray-400 py-4'>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border border-gray-400'>
              <td className='p-2 border border-gray-400'>2 Jan 2025</td>
              <td className='p-2 border border-gray-400'>Batu Bara</td>
              <td className='p-2 border border-gray-400 text-right'>10.000.000</td>
              <td className='p-2 border border-gray-400 text-right'>20</td>
              <td className='p-2 border border-gray-400 text-right'>200.000.000</td>
            </tr>
            <tr className='border border-gray-400 '>
              <td className='p-2 border border-gray-400'>5  Jan 2025</td>
              <td className='p-2 border border-gray-400'>Batu Bara</td>
              <td className='p-2 border border-gray-400 text-right'>5.000.000</td>
              <td className='p-2 border border-gray-400 text-right'>20</td>
              <td className='p-2 border border-gray-400 text-right'>100.000.000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='mb-8'>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className=""></div>
          <div className="">
            <div className="flex justify-between items-center mb-2 font-bold">
              <div>Total Price</div>
              <div>300.000.000</div>
            </div>
            <hr className='border-1 border-gray-100 my-2' />
            <div className="flex justify-between items-center mb-2">
              <div>DP</div>
              <div>100.000.000</div>
            </div>
            <div className="flex justify-between items-center mb-2 font-bold text-green-500">
              <div>Total Payment</div>
              <div>100.000.000</div>
            </div>
            <hr className='border-1 border-gray-100 my-2' />
            <div className="flex justify-between items-center mb-2 font-bold text-red-500">
              <div>Outstanding</div>
              <div>200.000.000</div>
            </div>
          </div>
        </div>
      </div>
      <div className='mb-8 flex justify-end'>
        <div className='text-center'>
          <div>Mengetahui, ..................</div>
          <div className='h-20'></div>
          <div>.....................</div>
        </div>
      </div>
    </div>
  )
};


export default Index;
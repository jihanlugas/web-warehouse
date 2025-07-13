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
          <div className="text-3xl font-bold uppercase">Surat Jalan</div>
        </div>
      </div>
      <hr className="border my-4" />
      <div className="mb-8">
        <div className="text-xl font-bold">Tujuan</div>
        <div>Marunda</div>
        <div className="">Jl. Tambang Raya No. 88, Kalimantan Selatan</div>
        <div className="">Telp. (0511) 12345678</div>
        <div className="">Email: info@majujaya.co.id</div>
      </div>
      <div className='mb-8'>
        <div className='mb-4'>Rincian Pengiriman:</div>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left border-y-3 border-gray-400">
              <th className="px-2 py-4 w-16">No</th>
              <th className='px-2 py-4'>Produk</th>
              <th className='px-2 py-4'>Jumlah</th>
              <th className='px-2 py-4'>Satuan</th>
              <th className='px-2 py-4'>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b border-gray-400'>
              <td className='p-2'>1</td>
              <td className='p-2'>Batu Bara</td>
              <td className='p-2'>100.000</td>
              <td className='p-2'>Ton</td>
              <td className='p-2'>-</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='mb-8'>
        <div className='mb-4'>Kendaraan:</div>
        <table className='mb-4'>
          <tr className=''>
            <td className='pr-4'>Jenis Kendaraan</td>
            <td className=''>Truck</td>
          </tr>
          <tr className=''>
            <td className='pr-4'>Nomor Kendaraan</td>
            <td className='uppercase'>B 1235 S</td>
          </tr>
          <tr className=''>
            <td className='pr-4'>Pengemudi</td>
            <td className=''>Budi Jaya Santoso</td>
          </tr>
          <tr className=''>
            <td className='pr-4'>Nomor Handphone</td>
            <td className=''>+62 123 456548855</td>
          </tr>
        </table>
        <div className='flex'>
          <div className='mr-4'>Tanggal Berangkat:</div>
          <div className='mr-4 font-bold'>20 Januari 2025</div>
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
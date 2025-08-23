import Breadcrumb from '@/components/component/breadcrumb';
import ButtonSubmit from '@/components/formik/button-submit';
import TextAreaField from '@/components/formik/text-area-field';
import TextField from '@/components/formik/text-field';
import { Api } from '@/lib/api';
import PageWithLayoutType from '@/types/layout';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import notif from "@/utils/notif";
import MainOperator from '@/components/layout/main-operator';
import DropdownField from '@/components/formik/dropdown-field';
import { PageProduct, ProductView } from '@/types/product';
import { useState, useEffect } from 'react';
import TextFieldNumber from '@/components/formik/text-field-number';
import { PageVehicle, VehicleView } from '@/types/vehicle';
import { displayNumber } from '@/utils/formater';
import { LoginUser } from '@/types/auth';
import { CreateTransferout } from '@/types/transferout';


type Props = {
  loginUser: LoginUser
}

const schema = Yup.object().shape({
  isDirect: Yup.boolean(),
  isNewVehiclerdriver: Yup.boolean(),
  toWarehouseId: Yup.string().required("Required Field"),
  productId: Yup.string().required("Required Field"),
  vehicleId: Yup.string().when('isNewVehiclerdriver', {
    is: false,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  plateNumber: Yup.string().when('isNewVehiclerdriver', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  vehicleName: Yup.string().when('isNewVehiclerdriver', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  driverName: Yup.string().when('isNewVehiclerdriver', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  phoneNumber: Yup.string().when('isNewVehiclerdriver', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
  sentGrossQuantity: Yup.number(),
  sentTareQuantity: Yup.number(),
  sentNetQuantity: Yup.number(),
  stockmovementvehicleId: Yup.string().when('isDirect', {
    is: true,
    then: schema => schema.required('Required Field'),
    otherwise: schema => schema.notRequired(),
  }),
});

const initFormikValue: CreateTransferout = {
  isNewVehiclerdriver: false,
  plateNumber: '',
  vehicleName: '',
  nik: '',
  driverName: '',
  phoneNumber: '',
  toWarehouseId: '',
  notes: '',
  productId: '',
  vehicleId: '',
  sentGrossQuantity: '',
  sentTareQuantity: '',
  sentNetQuantity: '',
}

const pageRequestProduct: PageProduct = {
  limit: -1,
}

const pageRequestVehicle: PageVehicle = {
  limit: -1,
}

const New: NextPage<Props> = ({ loginUser }) => {

  pageRequestVehicle.warehouseId = loginUser.user.warehouseId

  const router = useRouter();
  const [products, setProducts] = useState<ProductView[]>([]);
  const [destinations, setDestinations] = useState<{ label: string, value: string }[]>([]);
  const [vehicles, setVehicles] = useState<(VehicleView & { label: string })[]>([]);

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['stockmovementvehicle', 'transfer-out', 'create'],
    mutationFn: (val: FormikValues) => Api.post('/stockmovementvehicle/transfer-out', val),
  });

  const { isLoading: isLoadingProduct, data: dataProduct } = useQuery({
    queryKey: ['product', pageRequestProduct],
    queryFn: ({ queryKey }) => Api.get('/product', queryKey[1] as object),
  });

  const preloadsWarehouse = 'Warehousedestinations,Warehousedestinations.ToWarehouse'
  const { isLoading: isLoadingWarehouse, data: dataWarehouse } = useQuery({
    queryKey: ['warehouse', loginUser.user.warehouseId],
    queryFn: () => Api.get('/warehouse/' + loginUser.user.warehouseId, { preloads: preloadsWarehouse }),
  });

  const { isLoading: isLoadingVehicle, data: dataVehicle } = useQuery({
    queryKey: ['vehicle', pageRequestVehicle],
    queryFn: ({ queryKey }) => Api.get('/vehicle', queryKey[1] as object),
  });


  useEffect(() => {
    if (dataProduct?.status) {
      setProducts(dataProduct.payload.list);
    }
  }, [dataProduct]);

  useEffect(() => {
    if (dataWarehouse?.status) {
      const newList = []
      dataWarehouse.payload.warehousedestinations?.map((destination) => {
        newList.push({
          label: destination.toWarehouse.name,
          value: destination.toWarehouseId
        })
      })

      setDestinations(newList);
    }
  }, [dataWarehouse]);

  useEffect(() => {
    if (dataVehicle?.status) {
      const newList = []
      dataVehicle.payload.list.map(data => {
        newList.push({
          ...data,
          label: data.plateNumber + ' | ' + data.driverName
        })
      })
      setVehicles(newList);
    }
  }, [dataVehicle]);

  const handleChangeVehicleType = (setFieldValue, val: boolean) => {
    setFieldValue('isNewVehiclerdriver', val);
    setFieldValue('vehicleId', '');
    setFieldValue('plateNumber', '');
    setFieldValue('vehicleName', '');
    setFieldValue('driverName', '');
    setFieldValue('phoneNumber', '');
  }

  const handleSubmit = async (values: CreateTransferout, formikHelpers: FormikHelpers<CreateTransferout>) => {
    values.sentGrossQuantity = parseFloat(values.sentGrossQuantity as string) || 0
    values.sentTareQuantity = parseFloat(values.sentTareQuantity as string) || 0
    values.sentNetQuantity = values.sentGrossQuantity - values.sentTareQuantity
    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          // formikHelpers.resetForm();
          router.push('/transfer-out')
        } else if (payload?.listError) {
          formikHelpers.setErrors(payload.listError);
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      }
    });
  }

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Buat Pengiriman Keluar'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Pengiriman Keluar', path: '/transfer-out' },
            { name: 'Buat', path: '' },
          ]}
        />
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>Buat Pengiriman Keluar</div>
          </div>
          <div>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
            >
              {({ values, errors, setFieldValue }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4 max-w-xl">
                      <DropdownField
                        label={"Product"}
                        name={"productId"}
                        items={products}
                        keyValue={"id"}
                        keyLabel={"name"}
                        isLoading={isLoadingProduct}
                        placeholder="Pilih Product"
                        placeholderValue={""}
                        field={true}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl ">
                      <div className="flex items-center">
                        <label className="flex items-center mr-4">
                          <input type="radio" className="h-4 w-4 mr-2 accent-current" onChange={() => handleChangeVehicleType(setFieldValue, false)} checked={!values.isNewVehiclerdriver} />
                          <span>Kendaraan Tersimpan</span>
                        </label>
                        <label className="flex items-center mr-4">
                          <input type="radio" className="h-4 w-4 mr-2 accent-current" onChange={() => handleChangeVehicleType(setFieldValue, true)} checked={values.isNewVehiclerdriver} />
                          <span>Kendaraan Baru</span>
                        </label>
                      </div>
                    </div>
                    {values.isNewVehiclerdriver ? (
                      <>
                        <div className="mb-4 max-w-xl">
                          <TextField
                            label={'Kendaraan'}
                            name={'vehicleName'}
                            type={'text'}
                            placeholder={'Kendaraan'}
                            required
                          />
                        </div>
                        <div className="mb-4 max-w-xl">
                          <TextField
                            label={'Nomor Kendaraan'}
                            name={'plateNumber'}
                            type={'text'}
                            placeholder={'B 123...'}
                            className='uppercase'
                            required
                          />
                        </div>
                        <div className="mb-4 max-w-xl">
                          <TextField
                            label={'Nama Supir / Penanggung Jawab'}
                            name={'driverName'}
                            type={'text'}
                            placeholder={'Nama Supir / Penanggung Jawab'}
                            required
                          />
                        </div>
                        <div className="mb-4 max-w-xl">
                          <TextField
                            label={'Nomor Telepon'}
                            name={'phoneNumber'}
                            type={'text'}
                            placeholder={'628...'}
                            required
                          />
                        </div>
                      </>
                    ) : (
                      <div className="mb-4 max-w-xl">
                        <DropdownField
                          label={"Kendaraan"}
                          name={"vehicleId"}
                          items={vehicles}
                          keyValue={"id"}
                          keyLabel={"label"}
                          isLoading={isLoadingVehicle}
                          placeholder="Pilih Vehicle"
                          placeholderValue={""}
                          field={true}
                          required
                        />
                      </div>
                    )}
                    <div className="mb-4 max-w-xl">
                      <DropdownField
                        label={"Warehouse Tujuan"}
                        name={"toWarehouseId"}
                        items={destinations}
                        keyValue={"value"}
                        keyLabel={"label"}
                        isLoading={isLoadingWarehouse}
                        placeholder="Pilih Warehouse"
                        placeholderValue={""}
                        field={true}
                        required
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextAreaField
                        label={'Catatan'}
                        name={'notes'}
                        placeholder={'Catatan'}
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextFieldNumber
                        label={'Berat Kosong'}
                        name={`sentTareQuantity`}
                        placeholder={'1...'}
                      />
                    </div>
                    <div className="mb-4 max-w-xl">
                      <TextFieldNumber
                        label={'Berat Kotor'}
                        name={`sentGrossQuantity`}
                        placeholder={'1...'}
                      />
                    </div>
                    <div className="mb-4 max-w-xl flex justify-between items-center">
                      <div>Berat Bersih</div>
                      <div>{displayNumber((parseFloat(values.sentGrossQuantity as string || "0") - parseFloat(values.sentTareQuantity as string || "0")))}</div>
                    </div>
                    <div className="mb-8 max-w-xl">
                      <ButtonSubmit
                        label={'Simpan'}
                        disabled={isPending}
                        loading={isPending}
                      />
                    </div>
                    {process.env.DEBUG === 'true' && (
                      <>
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(values, null, 4)}
                        </div>
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(errors, null, 4)}
                        </div>
                      </>
                    )}
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div >
    </>
  );
}

(New as PageWithLayoutType).layout = MainOperator;

export default New;
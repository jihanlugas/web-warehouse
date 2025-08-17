import Modal from "@/components/modal/modal";
import { PageUser } from "@/types/user";
import { NextPage } from "next/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import DateField from "@/components/formik/date-field";
import { PageWarehouse, WarehouseView } from "@/types/warehouse";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import DropdownField from "../formik/dropdown-field";


type Props = {
  show: boolean;
  onClickOverlay: () => void;
  filter: PageUser
  setFilter: Dispatch<SetStateAction<PageUser>>
}

const pageRequestWarehouse: PageWarehouse = {
  limit: -1,
}

const schema = Yup.object().shape({
});

const ModalFilterUser: NextPage<Props> = ({ show, onClickOverlay, filter, setFilter }) => {

  const [initFormikValue, setInitFormikValue] = useState<PageUser>(filter)
  const [warehouses, setWarehouses] = useState<WarehouseView[]>([]);

  const { isLoading: isLoadingWarehouse, data: dataWarehouse } = useQuery({
    queryKey: ['warehouse', pageRequestWarehouse],
    queryFn: ({ queryKey }) => Api.get('/warehouse', queryKey[1] as object),
  });

  const handleSubmit = async (values: PageUser) => {
    setFilter(values)
    onClickOverlay()
  }

  const handleClear = () => {
    setFilter({
      warehouseId: '',
      fullname: '',
      email: '',
      phoneNumber: '',
      username: '',
      address: '',
      birthPlace: '',
      createName: '',
      startCreateDt: '',
      endCreateDt: '',
    })
    onClickOverlay()
  }

  const handleClearStartCreateDt = (setFieldValue) => {
    setFieldValue('startCreateDt', '')
  }

  const handleClearEndCreateDt = (setFieldValue) => {
    setFieldValue('endCreateDt', '')
  }

  useEffect(() => {
    if (show) {
      setInitFormikValue(filter)
    }
  }, [show])

  useEffect(() => {
    if (dataWarehouse?.status) {
      setWarehouses(dataWarehouse.payload.list);
    }
  }, [dataWarehouse]);


  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Filter User</div>
          <button type="button" onClick={() => onClickOverlay()} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4 border-gray-200" />
        <div>
          <div className="ml-auto">
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ setFieldValue }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4">
                      <DropdownField
                        label={"Warehouse"}
                        name={"warehouseId"}
                        items={warehouses}
                        keyValue={"id"}
                        keyLabel={"name"}
                        isLoading={isLoadingWarehouse}
                        placeholder="Pilih Warehouse"
                        placeholderValue={""}
                        field={true}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Name User'}
                        name={'fullname'}
                        type={'text'}
                        placeholder={'Name User'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Username'}
                        name={'username'}
                        type={'text'}
                        placeholder={'Username'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Email'}
                        name={'email'}
                        type={'email'}
                        placeholder={'Email'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Nomor Telepon'}
                        name={'phoneNumber'}
                        type={'text'}
                        placeholder={'Nomor Telepon'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextAreaField
                        label={'Address'}
                        name={'address'}
                        placeholder={'Address'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Tempat Lahir'}
                        name={'birthPlace'}
                        type={'text'}
                        placeholder={'Tempat Lahir'}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <DateField
                        label={'Created From'}
                        name={'startCreateDt'}
                        type={'date'}
                        handleClear={() => handleClearStartCreateDt(setFieldValue)}
                      />
                      <DateField
                        label={'Created To'}
                        name={'endCreateDt'}
                        type={'date'}
                        handleClear={() => handleClearEndCreateDt(setFieldValue)}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <ButtonSubmit
                        label={'Clear Filter'}
                        type="reset"
                        onClick={() => handleClear()}
                        className={'duration-300 border-2 text-gray-600 border-gray-400 hover:bg-gray-100 hover:border-gray-500 focus:border-gray-500 h-10 rounded-md font-semibold px-4 w-full shadow-lg shadow-gray-500/20'}
                      />
                      <ButtonSubmit
                        label={'Filter'}
                      />
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalFilterUser;
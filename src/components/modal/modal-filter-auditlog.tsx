import Modal from "@/components/modal/modal";
import { PageAuditlog } from "@/types/auditlog";
import { NextPage } from "next/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import TextField from "@/components/formik/text-field";
import DateField from "@/components/formik/date-field";
import { PageWarehouse, WarehouseView } from "@/types/warehouse";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import DropdownField from "../formik/dropdown-field";
import { AUDITLOG_TYPES, STOCKMOVEMENTVEHICLE_STATUSES, STOCKMOVEMENTVEHICLE_TYPES } from "@/utils/constant";
import TextFieldNumber from "../formik/text-field-number";


type Props = {
  show: boolean;
  onClickOverlay: () => void;
  filter: PageAuditlog
  setFilter: Dispatch<SetStateAction<PageAuditlog>>
}

const schema = Yup.object().shape({
});

const pageRequestWarehouse: PageWarehouse = {
  limit: -1,
}

const ModalFilterStockmovementvehicle: NextPage<Props> = ({ show, onClickOverlay, filter, setFilter }) => {

  const [initFormikValue, setInitFormikValue] = useState<PageAuditlog>(filter)
  const [warehouses, setWarehouses] = useState<WarehouseView[]>([])


  const { isLoading: isLoadingWarehouse, data: dataWarehouse } = useQuery({
    queryKey: ['warehouse', pageRequestWarehouse],
    queryFn: ({ queryKey }) => Api.get('/warehouse', queryKey[1] as object),
  });

  const handleSubmit = async (values: PageAuditlog) => {
    setFilter(values)
    onClickOverlay()
  }

  const handleClear = () => {
    setFilter({
      locationId: '',
      warehouseId: '',
      stockmovementvehicleId: '',
      title: '',
      description: '',
      startCreateDt: '',
      endCreateDt: '',
      createName: '',
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
          <div>Filter Stockmovementvehicle</div>
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
                      <TextField
                        label={'Title'}
                        name={'title'}
                        type={'text'}
                        placeholder={'Title'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Description'}
                        name={'description'}
                        type={'text'}
                        placeholder={'Description'}
                      />
                    </div>
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
                      <DropdownField
                        label={"Type"}
                        name={"auditlogType"}
                        items={AUDITLOG_TYPES}
                        keyValue={"value"}
                        keyLabel={"label"}
                        placeholder="Pilih Type"
                        placeholderValue={""}
                        field={true}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'User'}
                        name={'createName'}
                        type={'text'}
                        placeholder={'User'}
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

export default ModalFilterStockmovementvehicle;
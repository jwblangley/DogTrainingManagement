import dayjs from 'dayjs';

import { useState, useEffect, useContext } from 'react';

import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Stack, Dialog, Paper, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, Autocomplete } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


import { BackendContext } from './BackendProvider';


export default function Finances() {

    let backend = useContext(BackendContext)

    const [finances, setFinances] = useState([])
    const [rowSelectionModel, setRowSelectionModel] = useState([]);
    const [addingFinance, setAddingFinance] = useState(false);
    const [modifyingFinance, setModifyingFinance] = useState(false);
    const [deletingFinances, setDeletingFinances] = useState(false);

    const [addFinanceType, setAddFinanceType] = useState("misc");
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedInstructorId, setSelectedInstructorId] = useState(null);

    const [reportStartDate, setReportStartDate] = useState(dayjs().startOf("month"));
    const [reportEndDate, setReportEndDate] = useState(dayjs().endOf("month"));

    const [clients, setClients] = useState([])
    const [instructors, setInstructors] = useState([])

    const pullState = () => {
        backend.current.listFinances().then(data => {
            setFinances(data)
        })
        backend.current.listClients().then(data => {
            setClients(data)
        })
        backend.current.listInstructors().then(data => {
            setInstructors(data)
        })
    }

    const getFinance = (financeId) => {
        return finances.find(f => f.id === financeId)
    }

    useEffect(pullState, [])

    const concatenateName = (first, last) => `${`${first} ` || ''}${last || ''}`
    const getClient = (clientId) => {
        return clients.find(c => c.id === clientId)
    }
    const getInstructor = (instructorId) => {
        return instructors.find(i => i.id === instructorId)
    }

    const columns = [
        { field: 'date', headerName: 'Date', width: 100},
        { field: 'description', headerName: 'Description', width: 450 },
        { field: 'value', headerName: 'Value', width: 100,
            valueGetter: (value, row) => `${row.value > 0 ? '+' : ''}${row.value}`
        },
        { field: 'person', headerName: 'Client / Instructor', width: 250,
            valueGetter: (value, row) => {
                if (row.client_id) {
                    const client = getClient(row.client_id)
                    return concatenateName(client.first_name, client.last_name)
                }
                if (row.instructor_id) {
                    const instructor = getInstructor(row.instructor_id)
                    return concatenateName(instructor.first_name, instructor.last_name)
                }
            }
        },
        { field: 'session_credits', headerName: 'Session Credits', width: 150,
            valueGetter: (value, row) => row.session_credits || ''
        },

    ];

    const addFinance = ({ date, description, value, clientId, instructorId, sessionCredits }) => {
        backend.current.addNewFinance({
            "date": date.length > 0 ? dayjs(date, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
            "description": description,
            "value": value,
            "client_id": clientId,
            "instructor_id": instructorId,
            "session_credits": sessionCredits,
        }).then(() => {
            setAddingFinance(false)
            setSelectedClientId(null)
            setSelectedInstructorId(null)
            pullState()
        });
    }

    const modifyFinance = (financeId, { date, description, value, clientId, instructorId, sessionCredits }) => {
        backend.current.modifyFinance(financeId, {
            "date": date.length > 0 ? dayjs(date, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
            "description": description,
            "value": value,
            "client_id": clientId,
            "instructor_id": instructorId,
            "session_credits": sessionCredits,
        }).then(() => {
            setModifyingFinance(false)
            setRowSelectionModel([])
            setSelectedClientId(null)
            setSelectedInstructorId(null)
            pullState()
        });
    }

    const deleteFinances = () => {
        if (!confirm("Are you sure? This action is permanent and also affects historical records")) {
            return;
        }
        backend.current.deleteFinances(rowSelectionModel)
            .then(() => {
                setRowSelectionModel([])
                setDeletingFinances(false)
                pullState()
            })
    }

    return (
        <Stack spacing={2} direction="row">
            <Paper sx={{padding: 2, width: "70%", paddingBottom: "78px"}}>
                <Stack spacing={2} direction="row">
                    <Typography variant="h4">Finances</Typography>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setAddingFinance(true)
                            setAddFinanceType("misc")
                        }}
                        disabled={rowSelectionModel.length > 0}
                    >
                        Add
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setModifyingFinance(true)
                            const fin = getFinance(rowSelectionModel[0])
                            if (fin.client_id !== null) {
                                setAddFinanceType("client")
                            }
                            else if (fin.instructor_id !== null) {
                                setAddFinanceType("instructor")
                            }
                            else {
                                setAddFinanceType("misc")
                            }
                            setSelectedClientId(fin.client_id)
                            setSelectedInstructorId(fin.instructor_id)
                        }}

                        disabled={rowSelectionModel.length !== 1}
                    >
                        Modify
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setDeletingFinances(true)}
                        disabled={rowSelectionModel.length <= 0}
                    >
                        Delete
                    </Button>
                </Stack>
                <br />
                <DataGrid
                    rows={finances}
                    columns={columns}
                    gridRowId={(row) => row.id}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    initialState={{
                        pagination: { page: 0, pageSize: 10 },
                        sorting: {
                            sortModel: [{ field: "date", sort: 'desc' }],
                        },

                    }}
                    pageSizeOptions={[5, 10]}
                />
                <Dialog
                    open={addingFinance || modifyingFinance}
                    onClose={() => {
                        setAddingFinance(false)
                        setModifyingFinance(false)
                    }}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = {
                                ...Object.fromEntries((formData).entries()),
                                clientId: selectedClientId,
                                instructorId: selectedInstructorId,
                            }

                            console.assert(addingFinance != modifyingFinance)
                            if (addingFinance) {
                                addFinance(formJson)
                            } else if (modifyingFinance) {
                                modifyFinance(rowSelectionModel[0], formJson)
                            }
                        },
                    }}
                >
                    <DialogTitle>{addingFinance ? "Add New Income/Expense" : "Modify Income/Expense"}</DialogTitle>
                    <DialogContent>
                        <RadioGroup
                            row
                            value={addFinanceType}
                            onChange={e => {
                                const val = e.target.value
                                setAddFinanceType(val)
                                if (val !== "client") {
                                    setSelectedClientId(null)
                                }
                                if (val !== "instructor") {
                                    setSelectedInstructorId(null)
                                }

                            }}
                            name="financeType"
                        >
                            <FormControlLabel value="misc" control={<Radio />} label="Miscellaneous" />
                            <FormControlLabel value="client" control={<Radio />} label="Client" />
                            <FormControlLabel value="instructor" control={<Radio />} label="Instructor" />
                        </RadioGroup>
                        {
                            addFinanceType === "client" && (
                                <Autocomplete
                                    id="clientId" name="clientId"
                                    options={clients.filter(c => c.active).map(c => c.id)}
                                    value={selectedClientId}
                                    onChange={(e, v) => setSelectedClientId(v)}
                                    getOptionLabel={opt => {
                                        if (opt === null) {
                                            return ""
                                        }
                                        const c = clients.find(c => c.id === opt)
                                        return concatenateName(c.first_name, c.last_name)
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Client" variant="standard" fullWidth required/>}
                                />
                            )
                        }
                        {
                            addFinanceType === "instructor" && (
                                <Autocomplete
                                    id="instructorId" name="instructorId"
                                    options={instructors.filter(i => i.active).map(i => i.id)}
                                    value={selectedInstructorId}
                                    onChange={(e, v) => setSelectedInstructorId(v)}
                                    getOptionLabel={opt => {
                                        if (opt === null) {
                                            return ""
                                        }
                                        const i = instructors.find(i => i.id === opt)
                                        return concatenateName(i.first_name, i.last_name)
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Instructor" variant="standard" fullWidth required/>}
                                />
                            )
                        }
                        <DatePicker
                            label="Date"
                            id="date"
                            name="date"
                            defaultValue={modifyingFinance ? dayjs(getFinance(rowSelectionModel[0]).date, "YYYY-MM-DD") : null}
                            fullWidth
                            variant="standard"
                            sx={{
                                width: "100%"
                            }}
                            slotProps={{
                                textField: {
                                    variant: "standard"
                                }
                            }}
                        />
                        <TextField
                            id="value"
                            name="value"
                            label="Value (negative for expenses)"
                            type="number"
                            fullWidth
                            variant="standard"
                            defaultValue={modifyingFinance ? getFinance(rowSelectionModel[0]).value : ""}
                            slotProps={{
                                htmlInput: { maxLength: 15, step: ".01" }
                            }}
                        />
                        <TextField
                            id="description"
                            name="description"
                            label="Description"
                            fullWidth
                            variant="standard"
                            defaultValue={modifyingFinance ? getFinance(rowSelectionModel[0]).description : ""}
                            slotProps={{
                                htmlInput: { maxLength: 255 }
                            }}
                        />
                        {
                            (addFinanceType === "client" || addFinanceType === "instructor") && (
                                <TextField
                                    id="sessionCredits"
                                    name="sessionCredits"
                                    label="Session Credits (negative to remove)"
                                    type="number"
                                    fullWidth
                                    variant="standard"
                                    defaultValue={modifyingFinance ? getFinance(rowSelectionModel[0]).session_credits : ""}
                                    slotProps={{
                                        htmlInput: {inputMode: 'numeric', pattern: '[0-9-]'}
                                    }}
                                />
                            )
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            console.assert(addingFinance != modifyingFinance)
                            setAddingFinance(false)
                            setModifyingFinance(false)
                            setSelectedClientId(null)
                            setSelectedInstructorId(null)
                        }}>
                            Cancel
                        </Button>
                        <Button type="submit">{modifyingFinance ? "Modify" : "Add"}</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={deletingFinances}
                    onClose={() => setDeletingFinances(false)}
                >
                    <DialogTitle>{"Delete Selected Finance(s)?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {"Delete selected finance(s)? Please note that this will also delete any dogs with this finance as their owner"}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setDeletingFinances(false)}
                        >Cancel
                        </Button>
                        <Button
                            onClick={deleteFinances}
                            autoFocus
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
            <Paper sx={{ padding: 2, width: "30%"}}>
                <Stack spacing={2} direction="column">
                    <Typography variant="h4">Generate Statement</Typography>
                    <DatePicker
                        label="Statement start"
                        value={reportStartDate}
                        onChange={newValue => setReportStartDate(newValue)}
                    />
                    <DatePicker
                        label="Statement end"
                        value={reportEndDate}
                        onChange={newValue => setReportEndDate(newValue)}
                    />
                    <Button
                        variant='contained'
                        disabled={!reportStartDate.isValid() || !reportEndDate.isValid() || reportStartDate >= reportEndDate}
                        onClick={() => {
                            backend.current.generateFinanceStatement(
                                reportStartDate.format("YYYY-MM-DD"),
                                reportEndDate.format("YYYY-MM-DD")
                            )
                        }}
                    >
                        Generate
                    </Button>
                </Stack>
            </Paper>
        </Stack>
    )
}

import {post} from "@/packages/http/request.ts"

type params = {
    PageSize: number,
    PageIndex: number,
    OrderField: string,
    OrderType: string,
    BeginDT: string,
    EndDT: string,
    FuzzyName: string,
    UserID: string | number
}
const FindSluiceDataLast = (params: params) => {
    return post('/api/SluiceDataLast/Find', params)
}
const FindSluiceData = (params: params) => {
    return post('/api/SluiceData/Find', params)
}
interface Report {
    LocationID: string | number,
    StationID: string | number,
    Year: string | number,
}
const FindYearReport = (params: Report) => {
    return post('/api/SluiceReport/FindYearReport', params)
}
interface DayReport {
    LocationID: string | number,
    StationID: string | number,
    BeginDT: string,
    EndDT: string,
}
const FindDayReport = (params: DayReport) => {
    return post('/api/SluiceReport/FindDayReport', params)
}

export {
    FindSluiceDataLast,
    FindSluiceData,
    FindYearReport,
    FindDayReport,
}


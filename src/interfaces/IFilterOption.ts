

export interface IFilterOption {
    name?: string,
    dateStart?: string,
    dateEnd?: string,
    visible?: number,
    limit?: number,
    offsetPage?: number,
  }
  

export interface IFilterAttendanceRecord extends IFilterOption {
    employeeId?: string
}
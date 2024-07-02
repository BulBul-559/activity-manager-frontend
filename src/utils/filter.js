export const dateOptions = [
  {
    value: '周一',
    label: '周一'
  },
  {
    value: '周二',
    label: '周二'
  },
  {
    value: '周三',
    label: '周三'
  },
  {
    value: '周四',
    label: '周四'
  },
  {
    value: '周五',
    label: '周五'
  },
  {
    value: '周六',
    label: '周六'
  },
  {
    value: '周日',
    label: '周日'
  }
]

export const startTimeOptions = [
  {
    value: '08:00:00',
    label: '第一节'
  },
  {
    value: '08:55:00',
    label: '第二节'
  },
  {
    value: '10:05:00',
    label: '第三节'
  },
  {
    value: '11:00:00',
    label: '第四节'
  },
  {
    value: '14:00:00',
    label: '第五节'
  },
  {
    value: '14:55:00',
    label: '第六节'
  },
  {
    value: '16:05:00',
    label: '第七节'
  },
  {
    value: '17:00:00',
    label: '第八节'
  },
  {
    value: '19:00:00',
    label: '第九节'
  },
  {
    value: '19:55:00',
    label: '第十节'
  }
]

export const endTimeOptions = [
  {
    value: '08:45:00',
    label: '第一节'
  },
  {
    value: '09:40:00',
    label: '第二节'
  },
  {
    value: '10:50:00',
    label: '第三节'
  },
  {
    value: '11:45:00',
    label: '第四节'
  },
  {
    value: '14:45:00',
    label: '第五节'
  },
  {
    value: '15:40:00',
    label: '第六节'
  },
  {
    value: '16:50:00',
    label: '第七节'
  },
  {
    value: '17:45:00',
    label: '第八节'
  },
  {
    value: '19:45:00',
    label: '第九节'
  },
  {
    value: '20:40:00',
    label: '第十节'
  }
]
export const departmentOption = [
  { label: '程序部', value: '程序部' },
  { label: '媒体中心', value: '媒体中心' },
  { label: '共建中心', value: '共建中心' },
  { label: '美工部', value: '美工部' },
  { label: '综合部', value: '综合部' },
  { label: '闪客部', value: '闪客部' },
  { label: '视频推广部', value: '视频推广部' },
  { label: '摄影部', value: '摄影部' },
  { label: '管理组', value: '管理组' }
]

export const identityOption = [
  { label: '试用', value: '试用' },
  { label: '正式', value: '正式' },
  { label: '管理员', value: '管理员' }
]

export const dutyDayOption = [
  { label: '0：未安排', value: '0' },
  { label: '1：周一', value: '1' },
  { label: '2：周二', value: '2' },
  { label: '3：周三', value: '3' },
  { label: '4：周四', value: '4' },
  { label: '5：周五', value: '5' },
  { label: '6：周六', value: '6' },
  { label: '7：周日', value: '7' }
]
export const dutyFrameOption = [
  { label: '0：未安排', value: '0' },
  { label: '1：12节', value: '1' },
  { label: '2：34节', value: '2' },
  { label: '3：56节', value: '3' },
  { label: '4：78节', value: '4' },
  { label: '5：910节', value: '5' }
]

export const departmentFilter = [
  { text: '程序部', value: '程序部' },
  { text: '媒体中心', value: '媒体中心' },
  { text: '共建中心', value: '共建中心' },
  { text: '美工部', value: '美工部' },
  { text: '综合部', value: '综合部' },
  { text: '闪客部', value: '闪客部' },
  { text: '视频推广部', value: '视频推广部' },
  { text: '摄影部', value: '摄影部' },
  { text: '管理组', value: '管理组' }
]

export const stateFilter = [
  { text: '正在值班', value: '正在值班' },
  { text: '正常值班', value: '正常值班' },
  { text: '异常', value: '值班时间不足30分钟' }
]

export const identityFilter = [
  { text: '试用', value: '试用' },
  { text: '正式', value: '正式' },
  { text: '管理员', value: '管理员' }
]

export const formatterDay = (data) => {
  let res = ''
  res += '周'
  switch (data.day) {
    case 1:
      res += '一'
      break
    case 2:
      res += '二'
      break
    case 3:
      res += '三'
      break
    case 4:
      res += '四'
      break
    case 5:
      res += '五'
      break
    case 6:
      res += '六'
      break
    case 7:
      res += '日'
      break
  }
  return res
}

export const formatterFrame = (data) => {
  let res = ''
  res += '第'
  switch (data.frame) {
    case 1:
      res += '12节'
      break
    case 2:
      res += '34节'
      break
    case 3:
      res += '56节'
      break
    case 4:
      res += '78节'
      break
    case 5:
      res += '910节'
  }
  return res
}

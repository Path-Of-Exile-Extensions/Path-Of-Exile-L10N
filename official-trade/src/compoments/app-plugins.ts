import type {App} from "vue";
import {ElButton, ElButtonGroup, ElEmpty, ElForm, ElLink, ElMessage, ElSelect, ElSwitch, ElTooltip} from "element-plus";

import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/button-group/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/tooltip/style/css'
import 'element-plus/es/components/link/style/css'
import 'element-plus/es/components/form/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/switch/style/css'
import 'element-plus/es/components/empty/style/css'
import "./styles/index.css"


export default {
  install: (app: App) => {
    app.use(ElButton)
    app.use(ElButtonGroup)
    app.use(ElTooltip)
    app.use(ElForm)
    app.use(ElMessage)
    app.use(ElLink)
    app.use(ElSelect)
    app.use(ElSwitch)
    app.use(ElEmpty)
  },
};

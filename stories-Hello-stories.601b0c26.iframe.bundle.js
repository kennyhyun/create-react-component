"use strict";(self.webpackChunk_kennyhyun_create_react_component=self.webpackChunk_kennyhyun_create_react_component||[]).push([[532],{"./src/stories/Hello.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__={title:"Example/Hello",component:__webpack_require__("./src/index.tsx").qj,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{backgroundColor:{control:"color"}}},Primary={args:{primary:!0}};Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:"{\n  args: {\n    primary: true\n    // label: 'Button',\n  }\n}",...Primary.parameters?.docs?.source}}};const __namedExportsOrder=["Primary"]},"./src/index.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{qj:()=>Hello,zx:()=>Button});__webpack_require__("./node_modules/.pnpm/react@18.2.0/node_modules/react/index.js");var _mui_material_Button__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/.pnpm/@mui+material@5.14.11_@emotion+react@11.11.1_@emotion+styled@11.11.0_@types+react@18.2.22_react-dom@18.2.0_react@18.2.0/node_modules/@mui/material/Button/Button.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/.pnpm/react@18.2.0/node_modules/react/jsx-runtime.js");const Hello=()=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment,{children:"Hello"}),Button=_ref2=>{let{color:colorParam,primary,secondary,success,error,info,warning,label,variant="contained",...props}=_ref2;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material_Button__WEBPACK_IMPORTED_MODULE_2__.Z,{color:colorParam||(colors={primary,secondary,success,error,info,warning},Object.entries(colors).reduce(((acc,_ref)=>{let[key,value]=_ref;return acc||(value?key:void 0)}),""))||"primary",variant,...props,children:label});var colors};Button.displayName="Button";try{Button.displayName="Button",Button.__docgenInfo={description:"",displayName:"Button",props:{label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},ref:{defaultValue:null,description:"",name:"ref",required:!1,type:{name:"Ref<HTMLButtonElement>"}},component:{defaultValue:null,description:"",name:"component",required:!1,type:{name:"ElementType<any>"}},primary:{defaultValue:null,description:"",name:"primary",required:!1,type:{name:"boolean"}},secondary:{defaultValue:null,description:"",name:"secondary",required:!1,type:{name:"boolean"}},success:{defaultValue:null,description:"",name:"success",required:!1,type:{name:"boolean"}},error:{defaultValue:null,description:"",name:"error",required:!1,type:{name:"boolean"}},info:{defaultValue:null,description:"",name:"info",required:!1,type:{name:"boolean"}},warning:{defaultValue:null,description:"",name:"warning",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/index.tsx#Button"]={docgenInfo:Button.__docgenInfo,name:"Button",path:"src/index.tsx#Button"})}catch(__react_docgen_typescript_loader_error){}}}]);
import { styled } from "@mui/material"

//here we are creating an input element with diffrent style
export const VisuallyhiddenInput=styled("input")({
  border:0,
  clip:"rect(0,0,0,0)",
  height:1,
  margin:-1,
  overflow:"hidden",
  padding:0,
  position:"absolute",
  whiteSpace:"nowrap",
  width:1
})
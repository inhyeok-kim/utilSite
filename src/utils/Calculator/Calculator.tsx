import { styled } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { grey } from "@mui/material/colors"
import {useState, useEffect} from 'react'

const regNum = /[0-9]/;
const regOp = /[+-/x]/;
const regNoDup = /[+-/x%]/;
export default function Calculator(){
    const [calculations, setCalculations] = useState(['0'] as string[]);
    const [result, setResult] = useState('0');
    const [calcText, setCalcText] = useState('');
    function fnInput(input : string){
        let newCalculations = [...calculations];
        if(input === '='){
            const calResult = fnCalculation(newCalculations);
            setCalcText(newCalculations.join(''));
            newCalculations = calResult.split('');
        } else {
            if(input.match(regNum)){ //입력한 값이 숫자일 때
                if(newCalculations.length > 0){
                    if(newCalculations[newCalculations.length-1] === '%') return;
                    if(newCalculations[newCalculations.length-1] === '0'){
                        if(newCalculations.length === 1 ||
                            !newCalculations[newCalculations.length-2].match(regNum)){
                            if(!fnIsDecimal(newCalculations)){
                                newCalculations.pop();
                            }
                        }
                    }
                }
            } else { // 입력한 값이 숫자가 아닐 때
                if(input === '.'){
                    if(fnIsDecimal(newCalculations)) return;
                    if(!newCalculations[newCalculations.length-1].match(regNum)) return;
                }
                if(input.match(regOp)){
                    if(newCalculations[newCalculations.length-1].match(regOp)) return;
                }
                if(input === '%'){
                    if(newCalculations[newCalculations.length-1].match(regNoDup)) return;
                }
            }
            if(input === 'del'){
                if(newCalculations.length > 1){
                    newCalculations.pop();
                } else {
                    newCalculations[0] = '0';
                }
            } else {
                newCalculations.push(input);
            }
        }
        setCalculations(newCalculations);
    }

    function fnkeyInput(e : KeyboardEvent){
        if(e.key.match(regNum)) fnInput(e.key);
        if(e.key.match(regNoDup)) fnInput(e.key);
        if(e.key === 'Enter') fnInput('=');
        if(e.key === '*') fnInput('x');
        if(e.key === 'Backspace') fnInput('del');
        if(e.key === 'Escape') setCalculations(['0']);
    }
    
    useEffect(()=>{
        document.addEventListener('keydown',fnkeyInput);
        createResult();
        return ()=>{
            document.removeEventListener('keydown',fnkeyInput);
        }
    },[calculations])

    function createResult(){
        setResult(calculations.join(''));
    }

    return (
        <Grid2 xs={12}>
            <CalculatorView 
                fnInput={fnInput}
                result={result}
                calcText={calcText}
            />
        </Grid2>
    )
}

function fnCalculation(calc : string[]) : string{
    let target='0', next='', result='', operator = '';
    calc.forEach((elem,idx)=>{
        if(elem.match(regNum)){ // 숫자일 경우
            next += elem;
            if(idx === calc.length-1){
                if(operator){
                    target = fnCalc(target,next,operator);
                } else {
                    target = next;
                    next = '';
                }
            }
        } else {
            if(elem === "." || elem === "%") {
                next += elem;
            } else {
                if(operator){
                    target = fnCalc(target,next,operator);
                    next = '';
                } else {
                    target = next;
                    next = '';
                }
                operator = elem;
            }
        }
        if(idx === calc.length-1){
            result = target;
        }
    });
    return result;
}
function fnCalc(target : string, next : string, op : string){
    let result = '';
    switch (op){
        case "+":
            result = (parseFloat(target) + parseFloat(next)) +'';
            break;
        case "-":
            result = (parseFloat(target) - parseFloat(next)) +'';
            break;
        case "/":
            result = (parseFloat(target) / parseFloat(next)) +'';
            break;
        case "x":
            result = (parseFloat(target) * parseFloat(next)) +'';
            break;
    }
    return result;
}

function fnIsDecimal(calcs : string[]){
    for(let i=calcs.length-1; i > 0;i--){
        const elem = calcs[i];
        if(!elem.match(regNum) && elem != '.'){
            return false;
        } else if(elem === '.'){
            return true;
        }
    }
    return false;
}


const CalcButton = styled(Grid2)(({theme})=>({
    width : '24%',
    borderRadius : '5px',
    textAlign : 'center',
    padding : '10px 0px',
    background : grey[500],
    color : "white",
    fontSize : "20px",
    fontWeight : "bold",
    cursor : 'pointer',
    "&:hover" : {
        background : grey[900],
    }
}));

interface CalcProps {
    fnInput : Function
    result : string
    calcText : string
}
function CalculatorView({
    fnInput, result,calcText
} : CalcProps){

    return (
        <Grid2
            xs={12}
            bgcolor={grey["A400"]}
            padding={2}
        >
            <Grid2 
                xs={12}
                border={'2px solid white'}
                padding={"5px"}
                borderRadius={1}
                marginBottom={"5px"}
                sx={{height : '70px'}}
                > 
                <Grid2 xs={12}
                    textAlign={"right"}
                    fontSize={"15px"}
                    color={grey[700]}
                    fontWeight={"bold"}
                    sx={{height : '20px'}}
                    >
                    {calcText}
                </Grid2>
                <Grid2 xs={12}
                    textAlign={"right"}
                    fontSize={"30px"}
                    color={grey[900]}
                    fontWeight={"bold"}
                    sx={{height : '40px'}}
                    >
                    {result}
                </Grid2>
            </Grid2>

            <Grid2
                padding={"5px 0px"}
                container
                justifyContent={"space-between"}
                >
                <CalcButton 
                    onClick={()=>{fnInput("(")}}
                    >(
                </CalcButton>
                <CalcButton
                    onClick={()=>{fnInput(")")}}
                    >)
                </CalcButton>
                <CalcButton
                    onClick={()=>{fnInput("%")}}
                    >%
                </CalcButton>
                <CalcButton
                    onClick={()=>{fnInput("del")}}
                    >&lt;X
                </CalcButton>
            </Grid2>

            <Grid2
                padding={"5px 0px"}
                container
                justifyContent={"space-between"}
                >
                <CalcButton 
                    sx={{background : grey[800]}}
                    onClick={()=>{fnInput("7")}}
                    >7
                </CalcButton>
                <CalcButton
                    sx={{background : grey[800]}}
                    onClick={()=>{fnInput("8")}}
                    >8
                </CalcButton>
                <CalcButton
                    sx={{background : grey[800]}}
                    onClick={()=>{fnInput("9")}}
                    >9
                </CalcButton>
                <CalcButton
                    onClick={()=>{fnInput("/")}}
                    >/
                </CalcButton>
            </Grid2>

            <Grid2
                padding={"5px 0px"}
                container
                justifyContent={"space-between"}
                >
                <CalcButton 
                    sx={{background : grey[800]}}
                    onClick={()=>{fnInput("4")}}
                    >4
                </CalcButton>
                <CalcButton
                    sx={{background : grey[800]}}
                    onClick={()=>{fnInput("5")}}
                    >5
                </CalcButton>
                <CalcButton
                    sx={{background : grey[800]}}
                    onClick={()=>{fnInput("6")}}
                    >6
                </CalcButton>
                <CalcButton
                    onClick={()=>{fnInput("x")}}
                    >X
                </CalcButton>
            </Grid2>

            <Grid2
                padding={"5px 0px"}
                container
                justifyContent={"space-between"}
                >
                <CalcButton 
                    sx={{background : grey[800]}}
                    onClick={()=>{fnInput("1")}}
                    >1
                </CalcButton>
                <CalcButton
                    sx={{background : grey[800]}}
                    onClick={()=>{fnInput("2")}}
                    >2
                </CalcButton>
                <CalcButton
                    sx={{background : grey[800]}}
                    onClick={()=>{fnInput("3")}}
                    >3
                </CalcButton>
                <CalcButton
                    onClick={()=>{fnInput("-")}}
                    >-
                </CalcButton>
            </Grid2>

            <Grid2
                padding={"5px 0px"}
                container
                justifyContent={"space-between"}
                >
                <CalcButton 
                    sx={{background : grey[800]}}
                    onClick={()=>{fnInput("0")}}
                    >0
                </CalcButton>
                <CalcButton
                    sx={{background : grey[800]}}
                    onClick={()=>{fnInput(".")}}
                    >.
                </CalcButton>
                <CalcButton
                    sx={{background : grey[800]}}
                    onClick={()=>{fnInput("=")}}
                    >=
                </CalcButton>
                <CalcButton
                    onClick={()=>{fnInput("+")}}
                    >+
                </CalcButton>
            </Grid2>

        </Grid2>
    )
}
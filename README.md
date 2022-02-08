# README -- URL Query Parameters Guide

## Look at the list below for each of the supported requests and their usage

---

## **action**

### All commands must begin with an **`action`** parameter.

#### It's important to note that by default all non-dome lights are selected when using action.

Use the **`[targets](#targets)`** command to modify custom light combos. **This will not effect dome commands.**

##### Each of the options below are legal arguments to pass to **`action`**

- `togglePower`

- This argument will flip the power state of the non-dome light(s)

- `brightOneStep`

- This argument will increase the brightness of the non-dome light(s) by 1 step

- `dimOneStep`

- This argument will decrease the brightness of the non-dome light(s) by 1 step

- `fullBright`

- This argument will set the non-dome light(s) to the highest possible brightness

- `fullDim`

- This argument will set the non-dome light(s) to the lowest possible brightness

- `customBright`

- This argument will set the non-dome light(s) to a specific brightness percentage.
- If `customBright` is used then the **`[percent](#percent)`** parameter must also be passed

- `domeOn`

- This argument will turn the dome light on

- `domeOff`

- This argument will turn the dome light off

---

## **targets**

### Adding the **`targets`** parameter will make the **`[action](#action)`** parameter's command only apply to the lights defined in the targets array

##### Legal arguments to pass to the **`targets`** parameter are listed below, along with proper syntax examples

- `center`

- Controls the center light

- `left`

- Controls the left light

- `right`

- Controls the right light

- `dome`

- This is considered a legal argument, although none of the current action commands are effected by using the dome target since dome commands have their own action arguments

#### Syntax Format

`targets=[arg1,arg2,arg3]`

Each argument should be placed within straight brackets, without outer quotes, and comma seperated without spaces between arguments

#### Syntax Example 1

`targets=[center,left]`

This will control only the center and left lights, but leaves the right light uneffected

#### Syntax Example 2

`targets=[right]`

This will control only the right light, but leaves the others uneffected

---

## **percent**

### Specific actions may also require the **`percent`** parameter

##### Each of the options below are legal arguments to pass to **`percent`**

The percent argument accepts a numerical value between 1 and 100

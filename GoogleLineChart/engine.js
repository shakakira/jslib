/****************************************************************************************
* 											*
*		Copyright (C) 2009 Fran�ois Grondin. All Rights Reserved		*
*											*
* -------------------------------------------------------------------------------------	*
*											*
* The code in this website is the property of Fran�ois Grondin. Copyright and other 	*
* intellectual property laws protect these materials. Reproduction or retransmission of *
* the materials, in whole or in part, in any manner, without the prior consent of the 	*
* copyright holder, is a violation of copyright law.					*
*											*
* The author is not responsible for any damages whatsoever, including any type of loss	*
* of information, interruption of business, personal injury and/or any damage or 	*
* consequential damage without any limitation incurred before, during or after the use	*
* of this code.										*
*											*
****************************************************************************************/

// **********************************************************************
// *			       CONVERSIONS				*
// **********************************************************************

function dec2binInt(decString)
{

	var bufferSize = 13;
	var bufferMax = 10000000000000;

	var remainder;
	var padDecString;

	var bufferArray = new Array();
	var indexArray;
	var lengthArray;
	var zeroIndex;

	var roundNumberFigures;
	var indexFigures;

	var binArray = new Array("000","001","010","011","100","101","110","111");
	var outputBin;

	var checkAllZero;

	roundNumberFigures = Math.floor((Math.floor(Math.log(Math.pow(10,decString.length))/Math.LN2)+1)/3) * 3 + 3;

	var carry;

	var temp;

	// Check if the number of characters is a multiple of the buffersize
	remainder = decString.length - (Math.floor(decString.length/bufferSize) * bufferSize);

	// If not, pad with zeros
	padDecString = decString;

	if (remainder != 0)
	{

		for (var index = remainder; index < bufferSize; index++)
		{
			padDecString = "0" + padDecString;
		}	

	} 

	// Load string into array
	indexArray = 0;
	for (var index = 0; index < padDecString.length; index+=bufferSize)
	{

		bufferArray[indexArray] = parseInt(padDecString.substr(index,bufferSize), 10);

		indexArray++;

	}

	lengthArray = indexArray;



	// Shift right

	outputBin = "";
	indexFigures = 0;
	zerosCount = 0;

	checkAllZero = 1;
	while ((indexFigures < roundNumberFigures) && (checkAllZero != 0))
	{
		carry = 0;
		checkAllZero = 0;	

		for (var index = 0; index < lengthArray; index++)
		{
			
			bufferArray[index] += (carry * bufferMax);		

			temp = Math.floor(bufferArray[index]/8);

			carry = bufferArray[index] - (temp * 8);

			bufferArray[index] = temp;

			checkAllZero += bufferArray[index];

		}

		outputBin = binArray[carry] + outputBin;

		if (indexFigures !=0)
		{
			indexFigures += 3;
		}
		else
		{
			if (binArray[carry].indexOf("1") != -1)
			{
				indexFigures = 3 - binArray[carry].indexOf("1");
				zerosCount += 2 - binArray[carry].indexOf("1");
			}
			else
			{
				zerosCount += 3;
			}
		}

	}

	// Remove extra zeros
	if (outputBin.indexOf("1")==-1)
	{
		outputBin = "0";
	}
	else
	{
	outputBin = outputBin.substr(outputBin.indexOf("1"));
	}

	return outputBin;


}

function dec2binFrac(decString, numberFigures, intPartIsZero)
{

	var bufferSize = 15;
	var bufferMax = 1000000000000000;

	var remainder;
	var padDecString;

	var bufferArray = new Array();
	var indexArray;
	var lengthArray;
	var zeroIndex;

	var roundNumberFigures;
	var indexFigures;

	var binArray = new Array("000","001","010","011","100","101","110","111");
	var outputBin;

	var checkAllZero;
	var zerosCount;

	roundNumberFigures = Math.floor(numberFigures/3) * 3 + 3;

	var carry;

	var temp;

	// Check if the number of characters is a multiple of the buffersize
	remainder = decString.length - (Math.floor(decString.length/bufferSize) * bufferSize);

	// If not, pad with zeros
	padDecString = decString;

	if (remainder != 0)
	{

		for (var index = remainder; index < bufferSize; index++)
		{
			padDecString += "0";
		}	

	} 


	// Load string into array
	indexArray = 0;
	for (var index = 0; index < padDecString.length; index+=bufferSize)
	{

		bufferArray[indexArray] = parseInt(padDecString.substr(index,bufferSize), 10);

		indexArray++;

	}
	
	lengthArray = indexArray;


	// Shift left

	outputBin = "";
	if (intPartIsZero==0)
	{
		indexFigures = 0;
	}
	else
	{
		indexFigures = -1;
	}
	zerosCount = 0;

	checkAllZero = 1;
	while ((indexFigures < roundNumberFigures) && (checkAllZero != 0))
	{
		carry = 0;
		checkAllZero = 0;	

		for (var index = lengthArray-1; index >= 0; index--)
		{
			bufferArray[index] = bufferArray[index] * 8 + carry;

			carry = Math.floor(bufferArray[index] / bufferMax);

			bufferArray[index] -= carry * bufferMax;

			checkAllZero += bufferArray[index];

		}

		outputBin += binArray[carry];

		if (indexFigures !=-1)
		{
			indexFigures += 3;
		}
		else
		{
			if (binArray[carry].indexOf("1") != -1)
			{
				indexFigures = 3 - binArray[carry].indexOf("1");
				zerosCount += binArray[carry].indexOf("1");
			}
			else
			{
				zerosCount += 3;
			}
		}

	}

	// If not enough bits, pad with zeros
	if (outputBin.length < numberFigures)
	{

		temp = numberFigures - outputBin.length;

		for (var index = 0; index < temp; index++)
		{
			outputBin += "0";
		}
	}
	// Else remove extra bits
	else
	{
	outputBin = outputBin.substr(0,zerosCount + numberFigures);
	}

	return outputBin;

}

function bin2decInt(binString)
{

	var bufferSize = 15;
	var bufferMax = 1000000000000000;

	var bufferArray = new Array();
	var bufferLength;

	var remainder;
	var padString;

	var decString;
	var temp;

	if (binString.length<1024)
	{

		bufferLength = Math.floor((Math.floor(Math.log(Math.pow(2, binString.length))/Math.LN10) + 1) / bufferSize) + 1;
	}
	else
	{
		// Cannot calculate the log of 2^1024: overflow
		bufferLength = Math.floor((Math.floor(308.2547) + 1) / bufferSize) + 1;;
	}

	// Make sure the number of bits is a multiple of 3
	remainder = binString.length - (Math.floor(binString.length/3) * 3);

	padString = binString;

	if (remainder!=0)
	{
		for (var index = 0; index < (3-remainder); index++)
		{
			padString = "0" + padString;
		}	
	}

	// Initialize array
	for (var index = 0; index < bufferLength; index++)
	{
		bufferArray[index] = 0;
	}

	for (var indexBin = 0; indexBin < padString.length; indexBin+=3)
	{

		carry = parseInt(padString.substr(indexBin,3),2);

		for (var index = bufferLength - 1; index >= 0; index--)
		{
			bufferArray[index] = bufferArray[index] * 8 + carry;

			carry = Math.floor(bufferArray[index] / bufferMax);

			bufferArray[index] -= carry * bufferMax;

		}

	}

	decString = "";
	for (var index = 0; index < bufferLength; index++)
	{

		for (var index2 = 0; index2 < (bufferSize - (bufferArray[index] + "").length); index2++)
		{
			decString += "0";
		}

		decString += bufferArray[index];

	}

	// Remove extra zeros
	temp = -1;

	for (var index=0; index < decString.length; index++)
	{
		if (decString.charAt(index) != "0")
		{
			temp = index;
			break;
		}
	}

	if (temp==-1)
	{
		decString = "0";
	}
	else
	{
		decString = decString.substr(temp);
	}


	return decString;

}

function bin2decFrac(binString, numberFigures)
{

	var bufferSize = 13;
	var bufferMax = 10000000000000;
	var bufferLength;

	var remainder;

	var bufferArray = new Array();
	var indexArray;
	var lengthArray;

	var padString;

	var carry;
	var temp;

	var decString;
	var temp;

	bufferLength = Math.floor((numberFigures) / bufferSize) + 1;

	// Make sure the number of bits is a multiple of 3
	remainder = binString.length - (Math.floor(binString.length/3) * 3);

	padString = binString;

	if (remainder!=0)
	{
		for (var index = 0; index < (3-remainder); index++)
		{
			padString = padString + "0";
		}	
	}

	// Initialize array
	for (var index = 0; index < bufferLength; index++)
	{
		bufferArray[index] = 0;
	}



	// Shift right
	for (var indexBin = padString.length-3; indexBin >= 0; indexBin-=3)
	{
		carry = parseInt(padString.substr(indexBin,3),2);

		for (var index = 0; index < bufferLength; index++)
		{
			
			bufferArray[index] += (carry * bufferMax);		

			temp = Math.floor(bufferArray[index]/8);

			carry = bufferArray[index] - (temp * 8);

			bufferArray[index] = temp;

		}		
		
	}

	decString = "";
	for (var index = 0; index < bufferLength; index++)
	{

		for (var index2 = 0; index2 < (bufferSize - (bufferArray[index] + "").length); index2++)
		{
			decString += "0";
		} 
			
		decString += bufferArray[index];


	}

	temp = decString.length;

	if (decString.length<numberFigures)
	{
		for (var index = 0; index < (numberFigures - temp); index++)
		{
			decString += "0";
		}
	}
	else
	{
		decString = decString.substr(0,numberFigures);
	}

	return decString;

}

function roundBinary(binString, carry)
{

	var roundString;
	var sum;
	var digit;

	if (carry==1)
	{
		roundString = "";
		for (var index = binString.length-1; index >= 0; index--)
		{

			digit = parseInt(binString.charAt(index),10);

			if ((carry==1) && (digit==1))
			{
				sum = 0;
				carry = 1;
			}
			else if ((carry==0) && (digit==0))
			{
				sum = 0;
				carry = 0;
			}
			else
			{
				sum = 1;
				carry = 0;
			}

			roundString = sum + roundString;
		}

		if (carry==1)
		{
			roundString = carry + roundString;
		}

	}
	else
	{
		roundString = binString;
	}

	return roundString;

}

function bin2hex(binNumber)
{

	var arrayHex = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F");

	var hexNumber;

	hexNumber = "";

	for (var index=0; index < binNumber.length; index+=4)
	{
		hexNumber += arrayHex[parseInt(binNumber.substr(index,4),2)];
	}

	return hexNumber;

}

function hex2bin(hexNumber)
{

	var hexaString = "0123456789ABCDEF";
	var binaryArray = new Array ("0000","0001","0010","0011","0100","0101","0110","0111","1000","1001","1010","1011","1100","1101","1110","1111");

	var binaryString;

	binaryString = "";
	for (var index = 0; index < hexNumber.length; index++)
	{
		binaryString += binaryArray[hexaString.indexOf(hexNumber.charAt(index))];
	}

	return binaryString;

}

function fastDec2Bin(compareArray, numberCompare, expression)
{

	var binString;

	binString = "";
	
	for (var index = 0; index < numberCompare; index++)
	{

		if ((expression - compareArray[index])>=0)
		{
			expression -= compareArray[index];
			binString += "1";
		}
		else
		{
			binString += "0";
		}
	}

	return binString;
}

function fastBin2Dec(binString)
{

	var decNumber;
	
	decNumber = 0;

	for (var index = 0; index < binString.length; index++)
	{

		if (binString.charAt(index) == "1")
		{
			decNumber += Math.pow(2,binString.length-index-1);
		}
	}

	return decNumber;
}

// **********************************************************************
// *			         HELPERS				*
// **********************************************************************


function padZerosLeft(expression, numberZeros)
{

	for (var index = 0; index < numberZeros; index++)
	{
		expression = "0" + expression;
	}

	return expression;
	
}

function padZerosRight(expression, numberZeros)
{

	for (var index = 0; index < numberZeros; index++)
	{
		expression = expression + "0";
	}

	return expression;
	
}

function completeZerosLeft(expression, length)
{
	return padZerosLeft(expression.substr(0,length), length-expression.length);
}

function completeZerosRight(expression, length)
{
	return padZerosRight(expression.substr(0,length), length-expression.length);
}

function validateExpression(expression, numberFigures, reference)
{

	var newExpression;
	var validChar;
	
	for (var index = 0; index < expression.length; index++)
	{
		validChar = 0;

		for (var index2 = 0; index2 < reference.length; index2++)
		{		
			if (expression.charAt(index) == reference.charAt(index2))
			{
				validChar = 1;
			}
		}

		if (validChar == 0)
		{
			expression = "0";
			break;
		}
	}

	if (expression.length < numberFigures)
	{
		newExpression = expression;

		for (var index = 0; index < (numberFigures - expression.length); index++)
		{
			newExpression = reference.charAt(0) + newExpression;
		}
	}

	if (expression.length >= numberFigures)
	{
		newExpression = expression.substr(0, numberFigures);
	}


	return newExpression;

}

function validateBinary(expression, numberFigures)
{
	return validateExpression(expression, numberFigures, "01");
}

function validateHexadecimal(expression, numberFigures)
{
	return validateExpression(expression.toUpperCase(), numberFigures, "0123456789ABCDEF");
}

function integerFitRange(value, min, max)
{

	var temp;

	temp = parseInt(Math.floor(value)+"");
	
	if (temp<min)
	{
		temp = min;
	}
	if (temp>max)
	{
		temp = max;
	}

	return temp;

}

// **********************************************************************
// *			      	  OBJECTS				*
// **********************************************************************

// +--------------------------------------------------------------------+
// |			     Scientific Number				|
// +--------------------------------------------------------------------+

function ScientificNumber(sign, firstCoefficient, otherCoefficients, exponent)
{

	this.sign = sign;
	this.firstCoefficient = firstCoefficient;
	this.otherCoefficients = otherCoefficients;
	this.exponent = exponent;
	this.NaN = 0;
	this.infinity = 0;

	this.getNumber = ScientificNumber_getNumber;
	this.parse = ScientificNumber_parse;
	this.round = ScientificNumber_round;
	this.roundRemoveExtraZeros = ScientificNumber_roundRemoveExtraZeros;
}

function ScientificNumber_getNumber()
{
	var sign;

	if (this.NaN == 0)
	{

		if (this.sign == "-")
		{
			sign = "-";
		}
		else
		{
			sign = "";
		}

		if (this.infinity == 0)
		{

			return (sign + this.firstCoefficient + "." + this.otherCoefficients + "E" + this.exponent);
		}
		else
		{
			return (sign + "infinity");
		}

	}
	else
	{
		return "NaN";
	}

}

function ScientificNumber_parse(numberString)
{

	var char;
	var state;

	var PLUS;
	var MINUS;
	var DOT;
	var NZF;
	var F;
	var Z;
	var E;

	var sign;
	var coefficientFirst;
	var coefficientOthers;
	var expSign;
	var exponent;

	var noZeroCoefficientOthers;

	var temp;

	PLUS = "+";
	MINUS = "-";
	DOT = ".";
	NZF = "123456789";
	F = "0123456789";
	Z = "0";
	E = "Ee";

	sign = "+";
	coefficientFirst = "";
	coefficientOthers = "";
	expSign = 1;
	shift = 0;
	exponent = "";

	state = 0;

	for (var index = 0; index < numberString.length; index++)
	{

		char = numberString.charAt(index);

		switch(state)
		{
			case 0:
				state = -1;
				if (PLUS.indexOf(char) != -1) { state = 1; sign = "+"; }
				if (MINUS.indexOf(char) != -1) { state = 2; sign = "-"; }
				if (NZF.indexOf(char) != -1) { state = 3; sign = "+"; coefficientFirst = char; }
				if (DOT.indexOf(char) != -1) { state = 4; sign = "+"; shift--; }
				if (Z.indexOf(char) != -1) { state = 5; sign = "+"; }
				break;

			case 1:
				state = -1;
				if (NZF.indexOf(char) != -1) { state = 3; coefficientFirst = char; }
				if (DOT.indexOf(char) != -1) { state = 4; shift--; }
				if (Z.indexOf(char) != -1) { state = 5; }
				break;

			case 2:
				state = -1;
				if (NZF.indexOf(char) != -1) { state = 3; coefficientFirst = char; }
				if (DOT.indexOf(char) != -1) { state = 4; shift--; }
				if (Z.indexOf(char) != -1) { state = 5; }
				break;

			case 3:
				state = -1;
				if (DOT.indexOf(char) != -1) { state = 6; }
				if (F.indexOf(char) != -1) { state = 3; shift++; coefficientOthers += char; }
				if (E.indexOf(char) != -1) { state = 9; }
				break;

			case 4:
				state = -1;
				if (NZF.indexOf(char) != -1) { state = 8; coefficientFirst = char; }
				if (Z.indexOf(char) != -1) { state = 7; shift--; }
				break;

			case 5:
				state = -1;
				if (NZF.indexOf(char) != -1) { state = 3; coefficientFirst = char; }
				if (DOT.indexOf(char) != -1) { state = 4; shift--; }
				if (Z.indexOf(char) != -1) { state = 5; }
				break;

			case 6:
				state = -1;
				if (F.indexOf(char) != -1) { state = 6; coefficientOthers += char; }
				if (E.indexOf(char) != -1) { state = 9; }
				break;

			case 7:
				state = -1;
				if (Z.indexOf(char) != -1) { state = 7; shift--; }
				if (NZF.indexOf(char) != -1) { state = 8; coefficientFirst = char; }
				if (E.indexOf(char) != -1) { state = 9; }
				break;

			case 8:
				state = -1;
				if (F.indexOf(char) != -1) { state = 8; coefficientOthers += char; }
				if (E.indexOf(char) != -1) { state = 9; }
				break;

			case 9:
				state = -1;
				if (PLUS.indexOf(char) != -1) { state = 10; expSign = 1; }
				if (MINUS.indexOf(char) != -1) { state = 11; expSign = -1; }
				if (F.indexOf(char) != -1) { state = 12; expSign = 1; exponent += char; }
				break;

			case 10:
				state = -1;
				if (F.indexOf(char) != -1) { state = 12; exponent += char; }
				break;

			case 11:
				state = -1;
				if (F.indexOf(char) != -1) { state = 12; exponent += char; }
				break;

			case 12:
				state = -1;
				if (F.indexOf(char) != -1) { state = 12; exponent += char; }
				break;

		}

	}


	noZeroCoefficientOthers = "";

	if (state == -1)
	{

		if (numberString.toLowerCase()=="infinity")
		{
			this.sign = "+";
			this.firstCoefficient = "";
			this.otherCoefficients = "";
			this.exponent = 0;		
			this.NaN = 0;
			this.infinity = 1;

			return 0;
		}

		else if (numberString.toLowerCase()=="+infinity")
		{
			this.sign = "+";
			this.firstCoefficient = "";
			this.otherCoefficients = "";
			this.exponent = 0;		
			this.NaN = 0;
			this.infinity = 1;

			return 0;
		}

		else if (numberString.toLowerCase()=="-infinity")
		{
			this.sign = "-";
			this.firstCoefficient = "";
			this.otherCoefficients = "";
			this.exponent = 0;		
			this.NaN = 0;
			this.infinity = 1;

			return 0;
		}

		else
		{

			this.sign = "";
			this.firstCoefficient = "";
			this.otherCoefficients = "";
			this.exponent = 0;		
			this.NaN = 1;
			this.infinity = 0;

			return -1;

		}

		
	}

	state = 0;

	for (var index = coefficientOthers.length-1; index >= 0; index--)
	{
		char = coefficientOthers.charAt(index);		

		switch(state)
		{
			case 0:
				if (Z.indexOf(char) != -1) { state = 1; }
				if (NZF.indexOf(char) != -1) { state = 2; noZeroCoefficientOthers = char + noZeroCoefficientOthers; }
				break;

			case 1:
				if (Z.indexOf(char) != -1) { state = 1; }
				if (NZF.indexOf(char) != -1) { state = 2; noZeroCoefficientOthers = char + noZeroCoefficientOthers; }
				break;

			case 2:
				if (F.indexOf(char) != -1) { state = 2; noZeroCoefficientOthers = char + noZeroCoefficientOthers; }
				break;
		}

	}

	if (exponent == "")
	{
		exponent = "0";
	}
	exponent = ((parseInt(exponent,10))*expSign+shift) + "";

	if (noZeroCoefficientOthers == "")
	{
		noZeroCoefficientOthers = "0";
	}

	if (coefficientFirst == "")
	{
		coefficientFirst = "0";
		noZeroCoefficientOthers = "0";
		expSign = "+";
		exponent = "0";		
	}

	this.sign = sign;
	this.firstCoefficient = coefficientFirst;
	this.otherCoefficients = noZeroCoefficientOthers;
	this.exponent = parseInt(exponent,10);
	this.NaN = 0;
	this.infinity = 0;

	return 0;

}

function ScientificNumber_round(numberFigures)
{

	var otherCoefficients;
	var completeNumber;

	var char;
	var carry;
	var sum;

	var roundedNumber;

	otherCoefficients = completeZerosRight(this.otherCoefficients, numberFigures);

	completeNumber = this.firstCoefficient + otherCoefficients;

	if (parseInt(completeNumber.charAt(completeNumber.length-1),10)>=5)
	{
		carry = 1;
	}
	else
	{
		carry = 0;
	}

	completeNumber = completeNumber.substr(0, completeNumber.length-1);
	roundedNumber = "";
	
	for (var index = completeNumber.length-1; index >= 0; index--)
	{

		char = completeNumber.charAt(index);

		sum = parseInt(char,10)+carry;

		if (sum==10)
		{
			sum = 0;
			carry = 1;
		}
		else
		{
			carry = 0;
		}
		
		roundedNumber = sum + roundedNumber;

	}	

	if (carry==1)
	{
		this.firstCoefficient = "1";
		this.otherCoefficients = roundedNumber;
		this.exponent = this.exponent + 1;
	}
	else
	{
		this.firstCoefficient = roundedNumber.substr(0,1);
		this.otherCoefficients = roundedNumber.substr(1);
	}

}

function ScientificNumber_roundRemoveExtraZeros(numberFigures)
{
	this.round(numberFigures);
	this.parse(this.getNumber());
}

// +--------------------------------------------------------------------+
// |			     Decimal Number				|
// +--------------------------------------------------------------------+

function DecimalNumber(decInt, decFrac, sign, status)
{

	// +0:
	//
	// 	integer = "0"
	//	fractional = "0"
	//	sign = "+"
	//	status = "normal"
	//
	// -0:
	//
	// 	integer = "0"
	//	fractional = "0"
	//	sign = "-"
	//	status = "normal"
	//
	// +infinity:
	//
	// 	integer = ""
	//	fractional = ""
	//	sign = "+"
	//	status = "infinity"
	//
	// -infinity:
	//
	// 	integer = ""
	//	fractional = ""
	//	sign = "-"
	//	status = "infinity"
	//
	// NaN:
	//
	// 	integer = ""
	//	fractional = ""
	//	sign = ""
	//	status = "NaN"
	//
	//
	// 12.53:
	//
	// 	integer = "12"
	//	fractional = "53"
	//	sign = "+"
	//	status = "normal"
	//
	// -12.53:
	//
	// 	integer = "12"
	//	fractional = "53"
	//	sign = "-"
	//	status = "normal"
	//

	this.integer = decInt;
	this.fractional = decFrac;
	this.sign = sign;
	this.status = status;	

	this.getNumber = DecimalNumber_getNumber;
	this.fromScientific = DecimalNumber_fromScientific;
	this.fromSingle = DecimalNumber_fromSingle;
	this.fromDouble = DecimalNumber_fromDouble;	
}

function DecimalNumber_getNumber()
{
	if (this.status=="NaN")
	{
		return this.status;
	}
	else if (this.status=="infinity") 
	{
		return (this.sign + this.status);
	}
	else
	{
		return (this.sign + this.integer + "." + this.fractional);
	}
}

function DecimalNumber_fromScientific(sciNumber, expMin, expMax)
{

	var integer;
	var fractional;



	if (sciNumber.NaN == 0)
	{

		if (sciNumber.infinity == 1)
		{
			this.integer = "0";
			this.fractional = "0";
			this.sign = sciNumber.sign;
			this.status = "infinity";
		}

		else if ((sciNumber.exponent >= expMin) && (sciNumber.exponent <= expMax))
		{

			if (sciNumber.exponent < 0)
			{
				integer = "0";
				fractional = padZerosLeft(sciNumber.firstCoefficient + sciNumber.otherCoefficients, -1*sciNumber.exponent-1);
			}

			if (sciNumber.exponent >= 0)
			{
				integer = (sciNumber.firstCoefficient + (sciNumber.otherCoefficients).substr(0,sciNumber.exponent));
				integer = padZerosRight(integer, (sciNumber.exponent-(sciNumber.otherCoefficients).length));
				fractional = (sciNumber.otherCoefficients).substr(sciNumber.exponent);

				if (fractional == "")
				{
					fractional = "0";
				}
			}

			this.integer = integer;
			this.fractional = fractional;
			this.sign = sciNumber.sign;
			this.status = "normal";

		}

		else if (sciNumber.exponent < expMin)
		{
			this.integer = "0";
			this.fractional = "0";
			this.sign = sciNumber.sign;
			this.status = "normal";
		}

		else if (sciNumber.exponent > expMax)
		{
			this.integer = "";
			this.fractional = "";
			this.sign = sciNumber.sign;
			this.status = "infinity";
		}

	}
	else
	{
		this.integer = "";
		this.fractional = "";
		this.sign = "";
		this.status = "NaN";

	}

}

function DecimalNumber_fromSingle(ieeeNumber)
{

	var mantissa;
	var exponent;
	var sign;

	var binInt;
	var binFrac;

	var decInt;
	var decFrac;

	var status;

	var temp;

	mantissa = ieeeNumber.mantissa;
	exponent = ieeeNumber.exponent;
	sign = ieeeNumber.sign;

	if (exponent == 128)
	{
		if (parseInt(mantissa, 10) == 0)
		{
			status = "infinity";
		}
		else
		{
			status = "NaN";
		}
	}
	else
	{
		if (exponent == -127)
		{
			if (parseInt(mantissa, 10) == 0)
			{
				status = "zero";
			}
			else
			{
				exponent = -126;
				mantissa = "0" + mantissa;
				status = "denormalized";
			}
		}
		else
		{
			mantissa = "1" + mantissa;
			status = "normalized";
		}

		temp = mantissa.length;

		for (var index=0; index<24-temp; index++)
		{
			mantissa = mantissa + "0";
		}

		for (var index=0; index<(-exponent-1); index++)
		{
			mantissa = "0" + mantissa;
		}

		for (var index=0; index<(exponent-23); index++)
		{
			mantissa = mantissa + "0";
		}	

			

		binInt = mantissa.substr(0, exponent+1);
		binFrac = mantissa.substr(binInt.length);
		
		decInt = bin2decInt(binInt);
		decFrac = bin2decFrac(binFrac,149);

	}

	this.integer = decInt;
	this.fractional = decFrac;
	this.sign = sign;
	this.status = status;

}

function DecimalNumber_fromDouble(ieeeNumber)
{

	var mantissa;
	var exponent;
	var sign;

	var binInt;
	var binFrac;

	var decInt;
	var decFrac;

	var status;

	var temp;

	mantissa = ieeeNumber.mantissa;
	exponent = ieeeNumber.exponent;
	sign = ieeeNumber.sign;

	if (exponent == 1024)
	{
		if (parseInt(mantissa, 10) == 0)
		{
			status = "infinity";
		}
		else
		{
			status = "NaN";
		}
	}
	else
	{
		if (exponent == -1023)
		{
			if (parseInt(mantissa, 10) == 0)
			{
				status = "zero";
			}
			else
			{
				exponent = -1022;
				mantissa = "0" + mantissa;
				status = "denormalized";
			}
		}
		else
		{
			mantissa = "1" + mantissa;
			status = "normalized";
		}

		temp = mantissa.length;

		for (var index=0; index<53-temp; index++)
		{
			mantissa = mantissa + "0";
		}

		for (var index=0; index<(-exponent-1); index++)
		{
			mantissa = "0" + mantissa;
		}

		for (var index=0; index<(exponent-52); index++)
		{
			mantissa = mantissa + "0";
		}	

		binInt = mantissa.substr(0, exponent+1);
		binFrac = mantissa.substr(binInt.length);

		decInt = bin2decInt(binInt);
		decFrac = bin2decFrac(binFrac,1074);

	}

	this.integer = decInt;
	this.fractional = decFrac;
	this.sign = sign;
	this.status = status;

}

// +--------------------------------------------------------------------+
// |			        IEEE Single				|
// +--------------------------------------------------------------------+

function IEEESingle(mantissa, exponent, sign)
{

	this.mantissa = mantissa;
	this.exponent = exponent;
	this.sign = sign;

	this.getBinary = IEEESingle_getBinary;
	this.getHex = IEEESingle_getHex;	
	this.fromDecimal = IEEESingle_fromDecimal;
	this.fromHex = IEEESingle_fromHex;

}

function IEEESingle_getBinary()
{

	var exponent;
	var sign;

	var temp;

	exponent = dec2binInt((this.exponent+127)+"");

	temp = 8 - exponent.length;
	
	for (var index = 0; index < temp; index++)
	{
		exponent = "0" + exponent;
	}

	if (this.sign == "+")
	{
		sign = "0";
	}
	else
	{
		sign = "1";
	}

	return (sign + exponent + this.mantissa);

}

function IEEESingle_getHex()
{
	return bin2hex(this.getBinary());
}

function IEEESingle_fromHex(hexNumber)
{

	var binNumber;

	hexNumber = completeZerosLeft(hexNumber, 8);

	binNumber = hex2bin(hexNumber);

	if (binNumber.substr(0,1) == "0")
	{
		this.sign = "+";
	}
	else
	{
		this.sign = "-";
	}

	this.exponent = parseInt(binNumber.substr(1,8),2)-127;
	this.mantissa = binNumber.substr(9,23);

}

function IEEESingle_fromDecimal(decNumber)
{

	var decInt;
	var decFrac;
	var sign;
	
	decInt = decNumber.integer;
	decFrac = decNumber.fractional;
	sign = decNumber.sign;

	var binInt;
	var binFrac;
	var allString;
	var deNorm;

	var exponent;
	var mantissa;
	var temp;

	if (decNumber.status == "infinity")
	{
		this.mantissa = "00000000000000000000000";
		this.exponent = 128;
		this.sign = sign;
	}

	else if (decNumber.status == "NaN")
	{
		this.mantissa = "11111111111111111111111";
		this.exponent = 128;
		this.sign = "+";

	}

	else
	{

		binInt = dec2binInt(decInt);
	
		if (binInt != "0")
		{
			binFrac = dec2binFrac(decFrac, 25-binInt.length, 0);
		}
		else
		{

			binFrac = dec2binFrac(decFrac, 25, 1);
		}

		if ((parseInt(binInt,10) == 0) && (parseInt(binFrac,10) == 0))
		{

			exponent = -127;
			mantissa = "00000000000000000000000";
		}
		else
		{
			allString = binInt + "." + binFrac;

			exponent = allString.indexOf(".") - allString.indexOf("1");
	
			if (exponent>0)
			{
				exponent--;
			}

			if (exponent<-126)
			{
				deNorm = -126 - exponent;
			}
			else
			{
				deNorm = 0;
			}

			allString = binInt + binFrac;

			mantissa = allString.substr(allString.indexOf("1")+1-deNorm,24);

			temp = mantissa.length

			for (var index = 0; index < (23 - temp); index++)
			{
				mantissa += "0";
			}

			temp = roundBinary(mantissa.substr(0,23), parseInt(mantissa.charAt(23),10));


			if (temp.length > 23)
			{
				mantissa = temp.substr(1);
				exponent++;
			}
			else
			{
				mantissa = temp;
			}

			if (exponent < -126)
			{
				exponent = -127;
			}

			if (exponent > 127)
			{
				exponent = 128;
				mantissa = "00000000000000000000000";
			}
		}

		this.mantissa = mantissa;
		this.exponent = exponent;
		this.sign = sign;

	}

}

// +--------------------------------------------------------------------+
// |			        IEEE Double				|
// +--------------------------------------------------------------------+

function IEEEDouble(mantissa, exponent, sign)
{

	this.mantissa = mantissa;
	this.exponent = exponent;
	this.sign = sign;

	this.getBinary = IEEEDouble_getBinary;
	this.getHex = IEEEDouble_getHex;
	this.fromDecimal = IEEEDouble_fromDecimal;
	this.fromHex = IEEEDouble_fromHex;
}

function IEEEDouble_getBinary()
{

	var exponent;
	var sign;

	var temp;

	exponent = dec2binInt((this.exponent+1023)+"");

	temp = 11 - exponent.length;
	
	for (var index = 0; index < temp; index++)
	{
		exponent = "0" + exponent;
	}

	if (this.sign == "+")
	{
		sign = "0";
	}
	else
	{
		sign = "1";
	}

	return (sign + exponent + this.mantissa);

}

function IEEEDouble_getHex()
{
	return bin2hex(this.getBinary());
}

function IEEEDouble_fromHex(hexNumber)
{

	var binNumber;

	hexNumber = completeZerosLeft(hexNumber, 16);

	binNumber = hex2bin(hexNumber);

	if (binNumber.substr(0,1) == "0")
	{
		this.sign = "+";
	}
	else
	{
		this.sign = "-";
	}

	this.exponent = parseInt(binNumber.substr(1,11),2)-1023;
	this.mantissa = binNumber.substr(12,52);

}

function IEEEDouble_fromDecimal(decNumber)
{

	var decInt;
	var decFrac;
	var sign;
	
	decInt = decNumber.integer;
	decFrac = decNumber.fractional;
	sign = decNumber.sign;

	var binInt;
	var binFrac;
	var allString;
	var deNorm;

	var exponent;
	var mantissa;
	var temp;

	if (decNumber.status == "infinity")
	{
		this.mantissa = "0000000000000000000000000000000000000000000000000000";
		this.exponent = 1024;
		this.sign = sign;
	}

	else if (decNumber.status == "NaN")
	{
		this.mantissa = "1111111111111111111111111111111111111111111111111111";
		this.exponent = 1024;
		this.sign = "+";

	}

	else
	{

		binInt = dec2binInt(decInt);
	
		if (binInt != "0")
		{
			binFrac = dec2binFrac(decFrac, 54-binInt.length, 0);
		}
		else
		{
			binFrac = dec2binFrac(decFrac, 54, 1);
		}

		if ((parseInt(binInt,10) == 0) && (parseInt(binFrac,10) == 0))
		{

			exponent = -1023;
			mantissa = "0000000000000000000000000000000000000000000000000000";
		}
		else
		{

			allString = binInt + "." + binFrac;

			exponent = allString.indexOf(".") - allString.indexOf("1");
	
			if (exponent>0)
			{
				exponent--;
			}

			if (exponent<-1022)
			{
				deNorm = -1022 - exponent;
			}
			else
			{
				deNorm = 0;
			}
		
			allString = binInt + binFrac;

			mantissa = allString.substr(allString.indexOf("1")+1-deNorm,53);

			temp = mantissa.length

			for (var index = 0; index < (52 - temp); index++)
			{
				mantissa += "0";
			}

			temp = roundBinary(mantissa.substr(0,52), parseInt(mantissa.charAt(52),10));

			if (temp.length > 52)
			{
				mantissa = temp.substr(1);
				exponent++;
			}
			else
			{
				mantissa = temp;
			}

			if (exponent < -1022)
			{
				exponent = -1023;
			}

			if (exponent > 1023)
			{
				exponent = 1024;
				mantissa = "0000000000000000000000000000000000000000000000000000";
			}

		}

	this.mantissa = mantissa;
	this.exponent = exponent;
	this.sign = sign;
	
	}
}

// **********************************************************************
// *			    HIGH LEVEL CONVERSION			*
// **********************************************************************

function dec2Float(expression)
{

	var sci = new ScientificNumber("","","","");
	var dec = new DecimalNumber("","","","");
	var single = new IEEESingle("","","");
	
	sci.parse(expression);
	dec.fromScientific(sci,-45,45);
	single.fromDecimal(dec);

	return (single.getHex());

}

function dec2Double(expression)
{

	var sci = new ScientificNumber("","","","");
	var dec = new DecimalNumber("","","","");
	var double = new IEEEDouble("","","");
	
	sci.parse(expression);
	dec.fromScientific(sci,-324,324);
	double.fromDecimal(dec);

	return (double.getHex());

}

function float2Dec(expression, numberFigures)
{

	var sci = new ScientificNumber("","","","");
	var dec = new DecimalNumber("","","","");
	var single = new IEEESingle("","","");

	single.fromHex(expression);
	dec.fromSingle(single);
	sci.parse(dec.getNumber());

	if (numberFigures != -1)
	{
		sci.roundRemoveExtraZeros(numberFigures);
	}

	return (sci.getNumber());

}

function double2Dec(expression, numberFigures)
{

	var sci = new ScientificNumber("","","","");
	var dec = new DecimalNumber("","","","");
	var double = new IEEEDouble("","","");

	double.fromHex(expression);
	dec.fromDouble(double);
	sci.parse(dec.getNumber());

	if (numberFigures != -1)
	{
		sci.roundRemoveExtraZeros(numberFigures);
	}


	return (sci.getNumber());

}

function mostAccurateFloat(expression, numberFigures)
{

	return float2Dec(dec2Float(expression), numberFigures);

}

function mostAccurateDouble(expression, numberFigures)
{

	return double2Dec(dec2Double(expression), numberFigures);

}

function unsignedCharDec2Bin(expression)
{

	var compareArray = new Array(128,64,32,16,8, 4, 2, 1);

	var value;

	var sci = new ScientificNumber("","","","");
	var dec = new DecimalNumber("","","","");

	sci.parse(expression);
	dec.fromScientific(sci,0,2);
	value = dec.integer;

	if (dec.sign == "-")
	{
		value *= -1;
	}
	
	value =	integerFitRange(value, 0, 255);

	return fastDec2Bin(compareArray, 8, value);
	
}

function unsignedCharBin2Dec(expression)
{

	var value;

	value = fastBin2Dec(expression);
	
	value =	integerFitRange(value, 0, 255);

	return value;
	
}

function mostAccurateUnsignedChar(expression)
{

	return unsignedCharBin2Dec(unsignedCharDec2Bin(expression));

}

function signedCharDec2Bin(expression)
{

	var compareArray = new Array(128,64,32,16,8, 4, 2, 1);

	var value;

	var sci = new ScientificNumber("","","","");
	var dec = new DecimalNumber("","","","");
	sci.parse(expression);
	dec.fromScientific(sci,0,2);

	value = dec.integer;

	if (dec.sign == "-")
	{
		value *= -1;
	}

	value =	integerFitRange(value, -128, 127);
	
	if (value < 0)
	{
		value += compareArray[0]*2;
	}

	return fastDec2Bin(compareArray, 8, value);
	
}

function signedCharBin2Dec(expression)
{

	var value;

	value = fastBin2Dec(expression);
	
	value =	integerFitRange(value, 0, 255);

	if (value > 127)
	{
		value -= 256;
	}

	return value;
	
}

function mostAccurateSignedChar(expression)
{

	return signedCharBin2Dec(signedCharDec2Bin(expression));

}

function unsignedShortDec2Bin(expression)
{

	var compareArray = new Array(32768,16384,8192,4096,2048,1024,512,256,128,64,32,16,8, 4, 2, 1);

	var value;

	var sci = new ScientificNumber("","","","");
	var dec = new DecimalNumber("","","","");
	sci.parse(expression);
	dec.fromScientific(sci,0,5);

	value = dec.integer;

	if (dec.sign == "-")
	{
		value *= -1;
	}
	
	value =	integerFitRange(value, 0, 65535);

	return fastDec2Bin(compareArray, 16, value);
	
}

function unsignedShortBin2Dec(expression)
{

	var value;

	value = fastBin2Dec(expression);
	
	value =	integerFitRange(value, 0, 65535);

	return value;
	
}

function mostAccurateUnsignedShort(expression)
{

	return unsignedShortBin2Dec(unsignedShortDec2Bin(expression));

}

function signedShortDec2Bin(expression)
{

	var compareArray = new Array(32768,16384,8192,4096,2048,1024,512,256,128,64,32,16,8, 4, 2, 1);

	var value;

	var sci = new ScientificNumber("","","","");
	var dec = new DecimalNumber("","","","");
	sci.parse(expression);
	dec.fromScientific(sci,0,5);
	
	value = dec.integer;

	if (dec.sign == "-")
	{
		value *= -1;
	}

	value =	integerFitRange(value, -32768, 32767);

	if (value < 0)
	{
		value += compareArray[0]*2;
	}

	return fastDec2Bin(compareArray, 16, value);
	
}

function signedShortBin2Dec(expression)
{

	var value;

	value = fastBin2Dec(expression);
	
	value =	integerFitRange(value, 0, 65535);

	if (value > 32767)
	{
		value -= 65536;
	}

	return value;
	
}

function mostAccurateSignedShort(expression)
{

	return signedShortBin2Dec(signedShortDec2Bin(expression));

}

function unsignedIntDec2Bin(expression)
{

	var compareArray = new Array(2147483648,1073741824,536870912,268435456,134217728,67108864,33554432,16777216,8388608,4194304,2097152,1048576,524288,262144,131072,65536,32768,16384,8192,4096,2048,1024,512,256,128,64,32,16,8, 4, 2, 1);

	var value;

	var sci = new ScientificNumber("","","","");
	var dec = new DecimalNumber("","","","");
	sci.parse(expression);
	dec.fromScientific(sci,0,9);

	value = dec.integer;

	if (dec.sign == "-")
	{
		value *= -1;
	}
	
	value =	integerFitRange(value, 0, 4294967295);

	return fastDec2Bin(compareArray, 32, value);
	
}

function unsignedIntBin2Dec(expression)
{

	var value;

	value = fastBin2Dec(expression);
	
	value =	integerFitRange(value, 0, 4294967295);

	return value;
	
}

function mostAccurateUnsignedInt(expression)
{

	return unsignedIntBin2Dec(unsignedIntDec2Bin(expression));

}

function signedIntDec2Bin(expression)
{

	var compareArray = new Array(2147483648,1073741824,536870912,268435456,134217728,67108864,33554432,16777216,8388608,4194304,2097152,1048576,524288,262144,131072,65536,32768,16384,8192,4096,2048,1024,512,256,128,64,32,16,8, 4, 2, 1);

	var value;

	var sci = new ScientificNumber("","","","");
	var dec = new DecimalNumber("","","","");
	sci.parse(expression);
	dec.fromScientific(sci,0,9);

	value = dec.integer;

	if (dec.sign == "-")
	{
		value *= -1;
	}

	value =	integerFitRange(value, -2147483648, 2147483647);
	
	if (value < 0)
	{
		value += compareArray[0]*2;
	}

	return fastDec2Bin(compareArray, 32, value);
	
}

function signedIntBin2Dec(expression)
{

	var value;

	value = fastBin2Dec(expression);
	
	value =	integerFitRange(value, 0, 4294967295);

	if (value > 2147483647)
	{
		value -= 4294967296;
	}

	return value;
	
}

function mostAccurateSignedInt(expression)
{

	return signedIntBin2Dec(signedIntDec2Bin(expression));

}


// **********************************************************************
// *			          FORMATTING				*
// **********************************************************************
function formatInput(expression, maxChar)
{

	if (expression.length>maxChar)
	{
		return expression.substr(0,maxChar) + "...";
	}
	else
	{
		return expression;
	}

}


// **********************************************************************
// *			     ELEMENTS EXTRACTION			*
// **********************************************************************

function getFloatSign(hexNumber)
{

	var binNumber;

	binNumber = hex2bin(hexNumber);

	return binNumber.substr(0,1);

}

function getFloatExponent(hexNumber)
{

	var binNumber;

	binNumber = hex2bin(hexNumber);

	return binNumber.substr(1,8);

}

function getFloatMantissa(hexNumber)
{

	var binNumber;

	binNumber = hex2bin(hexNumber);

	return binNumber.substr(9,23);

}

function getDoubleSign(hexNumber)
{

	var binNumber;

	binNumber = hex2bin(hexNumber);

	return binNumber.substr(0,1);

}

function getDoubleExponent(hexNumber)
{

	var binNumber;

	binNumber = hex2bin(hexNumber);

	return binNumber.substr(1,11);

}

function getDoubleMantissa(hexNumber)
{

	var binNumber;

	binNumber = hex2bin(hexNumber);

	return binNumber.substr(12,52);

}
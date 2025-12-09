#include <stdio.h>
#include <stdlib.h>
#include <conio.h>
#include <windows.h>

int m,n,i,j,k;

void matrix_add();
void matrix_sub();
void matrix_mul();
void menu();

void main()
{
    int c;
    while(1)
    {
        menu();
    }
    getch();
}

void menu()
{
        system("cls");
        int c;
        printf("---Complete matrix Calculator---");
        printf("\n(1)Matrix addition\n(2)Matrix subtraction\n(3)Matrix Multiplication\n(4)Exit");
        printf("\nEnter:");
        scanf("%d",&c);
        switch(c)
        {
            case 1:system("cls");
                    matrix_add();
                    break;
            case 2:system("cls");
                    matrix_add();
                    break;
            case 3:system("cls");
                    matrix_mul();
                    break;
            case 4:exit(0);
                    break;
            default:printf("Invalied choice!\n");
                    return;
        }
}
void matrix_add()
{
    //Matrix 1
    printf("Enter the order of matrices(m*n):");
    scanf("%d %d",&m,&n);
    int **arr1=malloc(sizeof(int *)*m);
    if(arr1==NULL)
    {
        printf("\nMemory allocation failed!");
    }
    else
    {
        for(i=0;i<m;i++)
        {
            arr1[i]=calloc(n,sizeof(int));
            if(arr1[i]==NULL)
            {
                printf("\nMemory allocation failed:");
                break;
            }
        }
        printf("\nDynamic memory allocation successful...\n");
        printf("Enter matrix_1 elements:\n");
        for(i=0;i<m;i++)
        {
            for(j=0;j<n;j++)
            {
                printf("Enter a1[%d][%d]:",i+1,j+1);
                scanf("%d",&arr1[i][j]);
            }
        }
    }

    //Matrix 2
    int **arr2=malloc(sizeof(int *)*m);
    if(arr2==NULL)
    {
        printf("Memory allocation failed!");
    }
    else
    {
        for(i=0;i<m;i++)
        {
            arr2[i]=calloc(n,sizeof(int));
            if(arr2[i]==NULL)
            {
                printf("\nMemory allocation failed:");
                break;
            }
        }
        printf("\nDynamic memory allocation successful...\n");
        printf("Enter matrix_2 elements:\n");
        for(i=0;i<m;i++)
        {
            for(j=0;j<n;j++)
            {
                printf("Enter a2[%d][%d]:",i+1,j+1);
                scanf("%d",&arr2[i][j]);
            }
        }
    }

    printf("\nMatrix 1:\n");
    for(i=0;i<m;i++)
    {
        for(j=0;j<n;j++)
        {
            printf("%5d",arr1[i][j]);
        }
         putchar('\n');
    }

    //Addition of matrix
    for(i=0;i<m;i++)
    {
        for(j=0;j<n;j++)
        {
            arr1[i][j]+=arr2[i][j];
        }
    }

    printf("\nMatrix 2:\n");
    for(i=0;i<m;i++)
    {
        for(j=0;j<n;j++)
        {
            printf("%5d",arr2[i][j]);
        }
         putchar('\n');
    }
    
    printf("\nMatrix_1+Matrix_2\n");
    //Printing the result matrix
    for(i=0;i<m;i++)
    {
        for(j=0;j<n;j++)
        {
            printf("%5d",arr1[i][j]);
        }
        putchar('\n');
    }

    //Freeing memory
    for(i=0;i<m;i++)
    {
        free(arr1[i]);
        free(arr2[i]);
        arr1[i]=NULL;
        arr2[i]=NULL;
    }
    free(arr1);
    free(arr2);
    arr1=NULL;
    arr2=NULL;
    printf("\nMemory freed..");
    printf("\nPress any key to go back to menu");
    getch();
    menu();
}

void matrix_sub()
{
    //Matrix 1
    printf("Enter the order of matrices(m*n):");
    scanf("%d %d",&m,&n);
    int **arr1=malloc(sizeof(int *)*m);
    if(arr1==NULL)
    {
        printf("\nMemory allocation failed!");
    }
    else
    {
        for(i=0;i<m;i++)
        {
            arr1[i]=calloc(n,sizeof(int));
            if(arr1[i]==NULL)
            {
                printf("\nMemory allocation failed:");
                break;
            }
        }
        printf("\nDynamic memory allocation successful...\n");
        printf("Enter matrix_1 elements:\n");
        for(i=0;i<m;i++)
        {
            for(j=0;j<n;j++)
            {
                printf("Enter a1[%d][%d]:",i+1,j+1);
                scanf("%d",&arr1[i][j]);
            }
        }
    }

    //Matrix 2
    int **arr2=malloc(sizeof(int *)*m);
    if(arr2==NULL)
    {
        printf("Memory allocation failed!");
    }
    else
    {
        for(i=0;i<m;i++)
        {
            arr2[i]=calloc(n,sizeof(int));
            if(arr2[i]==NULL)
            {
                printf("\nMemory allocation failed:");
                break;
            }
        }
        printf("\nDynamic memory allocation successful...\n");
        printf("Enter matrix_2 elements:\n");
        for(i=0;i<m;i++)
        {
            for(j=0;j<n;j++)
            {
                printf("Enter a2[%d][%d]:",i+1,j+1);
                scanf("%d",&arr2[i][j]);
            }
        }
    }

    printf("\nMatrix 1:\n");
    for(i=0;i<m;i++)
    {
        for(j=0;j<n;j++)
        {
            printf("%5d",arr1[i][j]);
        }
         putchar('\n');
    }

    //Subtraction of matrix
    for(i=0;i<m;i++)
    {
        for(j=0;j<n;j++)
        {
            arr1[i][j]-=arr2[i][j];
        }
    }

    printf("\nMatrix 2:\n");
    for(i=0;i<m;i++)
    {
        for(j=0;j<n;j++)
        {
            printf("%5d",arr2[i][j]);
        }
         putchar('\n');
    }
    
    printf("\nMatrix_1-Matrix_2\n");
    //Printing the result matrix
    for(i=0;i<m;i++)
    {
        for(j=0;j<n;j++)
        {
            printf("%5d",arr1[i][j]);
        }
        putchar('\n');
    }

    //Freeing memory
    for(i=0;i<m;i++)
    {
        free(arr1[i]);
        free(arr2[i]);
        arr1[i]=NULL;
        arr2[i]=NULL;
    }
    free(arr1);
    free(arr2);
    arr1=NULL;
    arr2=NULL;
    printf("\nMemory freed..");
    printf("\nPress any key to go back to menu");
    getch();
    menu();
} 

//matrix multipication
void matrix_mul()
{
    printf("Enter the order of matrix_1:");
    int m1,n1;
    scanf("%d %d",&m1,&n1);
    if(m1!=n1)
    {
        printf("Invalied order!");
        return;
    }
    printf("Enter the order of matrix_2:");
    int m2,n2;
    scanf("%d %d",&m2,&n2);
    if(m2!=n2 || m1!=n2)
    {
        printf("Invalied order!");
        return;
    }
    int **arr1=malloc(sizeof(int *)*m1);
    if(arr1==NULL)
    {
        printf("Memory allocation has failed!");
        return;
    }
    printf("\nDynamic memory allocation successful..\n");
    for(i=0;i<m1;i++)
    {
        arr1[i]=calloc(n1,sizeof(int));
        if(arr1[i]==NULL)
        {
            printf("Memory allocation has failed!");
            return;
        }
    }
    printf("\nEnter the elements of matrix_1:\n");
    for(i=0;i<m1;i++)
    {
        for(j=0;j<n1;j++)
        {
            printf("Enter a1[%d][%d]:",i+1,j+1);
            scanf("%d",&arr1[i][j]);
        }
    }

    int **arr2=malloc(sizeof(int *)*m2);
    printf("\nDynamic memory allocation successful..\n");
    if(arr2==NULL)
    {
        printf("Memory allocation has failed!");
        return;
    }
    for(i=0;i<m2;i++)
    {
        arr2[i]=calloc(n2,sizeof(int));
        if(arr2[i]==NULL)
        {
            printf("Memory allocation failed!");
            return;
        }
    }
    printf("\nEnter matrix elementys for matrix_2:\n");
    for(i=0;i<m2;i++)
    {
        for(j=0;j<n2;j++)
        {
            printf("Enter a2[%d][%d]:",i+1,j+1);
            scanf("%d",&arr2[i][j]);
        }
    }

    int **res=malloc(sizeof(int *)*m1);
    if(res==NULL)
    {
        printf("Memory allocation has failed!");
    }
    printf("\nDynamic memory allocation successful..\n");
    for(i=0;i<m1;i++)
    {
        res[i]=calloc(n2,sizeof(int));
        if(res[i]==NULL)
        {
            printf("Memory allocation failed!");
        }
    }

    for(i=0;i<m1;i++)
    {
        for(j=0;j<n2;j++)
        {
            for(int r=0;r<n1;r++)
            {
                res[i][j]+=arr1[r][j]*arr2[i][r];
            }
        }
    }

    printf("\nMatrix_1:\n");
    for(i=0;i<m1;i++)
    {
        for(j=0;j<n1;j++)
        {
            printf("%5d",arr1[i][j]);
        }
        putchar('\n');
    }

    printf("\nMatrix_2:\n");
    for(i=0;i<m2;i++)
    {
        for(j=0;j<n2;j++)
        {
            printf("%5d",arr2[i][j]);
        }
        putchar('\n');
    }

    printf("\nMatrix_1*Matrix_2:\n");
    for(i=0;i<m1;i++)
    {
        for(j=0;j<n2;j++)
        {
            printf("%5d",res[i][j]);
        }
        putchar('\n');
    }

    for(i=0;i<m1;i++)
    {
        free(arr1[i]);
        free(res[i]);
        arr1[i]=NULL;
        res[i]=NULL;
    }

    for(i=0;i<m2;i++)
    {
        free(arr2[i]);
        arr2[i]=NULL;
    }

    free(arr1);
    free(arr2);
    free(res);

    arr1=NULL;
    arr2=NULL;
    res=NULL;
    printf("\nMemory freed...\n");
    printf("\nPress any key to go back to menu");
    getch();
    menu();
}

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLoginUser } from '@/services/auth/login';
import { useAuthStore } from '@/store/auth';
import { setTokens } from '@/lib/localStorage';
import { setHeaderToken } from '@/axios';

const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const { mutate, isPending } = useLoginUser();

    const setAll = useAuthStore((state) => state.setAll);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: FormValues) => {
        mutate(data, {
            onSuccess: (res) => {
                setTokens(res);
                setHeaderToken(res.access);

                setAll({
                    access: res.access,
                    refresh: res.refresh,
                });
            },
            onError: (err) => {
                console.error(err);
            },
        });
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Login with your Google account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="flex flex-col gap-4">
                            <Button variant="outline" className="w-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                        fill="currentColor"
                                    />
                                </svg>
                                Login with Google
                            </Button>
                        </div>
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                            <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                        <Form {...form}>
                            <form className="grid" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="mb-6">
                                            <FormLabel>E-Mail</FormLabel>
                                            <FormControl>
                                                <Input
                                                    //error={emailError}
                                                    autoComplete="on"
                                                    placeholder="user@appon.net"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <div className="flex justify-between">
                                                <FormLabel>Password</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    //error={passwordError}
                                                    autoComplete="on"
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button loading={isPending} type="submit" className="w-full">
                                    Log In
                                </Button>
                            </form>
                        </Form>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{' '}
                            <a href="#" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}

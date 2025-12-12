import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { useForm } from '../hooks/useForm';
import { useToast } from '../hooks/useToast';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const toast = useToast();

    const form = useForm(
        {
            firstName: '',
            lastName: '',
            phone: '',
        },
        async (values) => {
            await updateProfile(values);
            toast.success('Profil mis à jour avec succès');
        }
    );

    useEffect(() => {
        if (user) {
            form.setValue('firstName', user.firstName || '');
            form.setValue('lastName', user.lastName || '');
            form.setValue('phone', user.phone || '');
        }
    }, [user]);

    if (!user) {
        return (
            <div className="auth-container">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Mon Profil</h1>
                
                {form.error && <div className="error-message">{form.error}</div>}

                <form onSubmit={form.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">Prénom</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={form.values.firstName}
                            onChange={form.handleChange}
                            className={form.getFieldError('firstName') ? 'error' : ''}
                            disabled={form.isLoading}
                        />
                        {form.getFieldError('firstName') && <span className="error-text">{form.getFieldError('firstName')}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Nom</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={form.values.lastName}
                            onChange={form.handleChange}
                            className={form.getFieldError('lastName') ? 'error' : ''}
                            disabled={form.isLoading}
                        />
                        {form.getFieldError('lastName') && <span className="error-text">{form.getFieldError('lastName')}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            disabled
                            className="disabled"
                        />
                        <p className="form-help-text">L'email ne peut pas être modifié</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Téléphone (optionnel)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={form.values.phone}
                            onChange={form.handleChange}
                            className={form.getFieldError('phone') ? 'error' : ''}
                            disabled={form.isLoading}
                        />
                        {form.getFieldError('phone') && <span className="error-text">{form.getFieldError('phone')}</span>}
                    </div>

                    <button type="submit" className="auth-button" disabled={form.isLoading}>
                        {form.isLoading ? <LoadingSpinner size="small" /> : 'Enregistrer les modifications'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
